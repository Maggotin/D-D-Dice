import { animation_duration } from '../../../../script.js';
import { getContext } from '../../../extensions.js';
import { POPUP_TYPE, callGenericPopup } from '../../../popup.js';
import { SlashCommand } from '../../../slash-commands/SlashCommand.js';
import { ARGUMENT_TYPE, SlashCommandArgument, SlashCommandNamedArgument } from '../../../slash-commands/SlashCommandArgument.js';
import { commonEnumProviders } from '../../../slash-commands/SlashCommandCommonEnumsProvider.js';
import { SlashCommandParser } from '../../../slash-commands/SlashCommandParser.js';
import { isTrueBoolean } from '../../../utils.js';
export { MODULE_NAME, getDiceRollMacro };

const MODULE_NAME = 'dice';

/**
 * Enhanced dice roller with support for advanced notation
 */
const droll = (() => {
    // Main regex for dice notation with named capture groups
    const diceRegex = /^(?<count>\d+)?d(?<sides>\d+)(?:(?<keepDrop>k|kh|kl|d|dh|dl)(?<keepDropCount>\d+))?(?:(?<reroll>r|ro|rr)(?<rerollOp>[<>])(?<rerollVal>\d+))?(?<explode>!)?(?:(?<modOp>[+-])(?<modVal>\d+))?$/i;

    /**
     * Tokenizes a dice notation string into its components
     * @param {string} formula - The dice notation to tokenize
     * @returns {Object|null} - The tokenized components or null if invalid
     */
    function tokenize(formula) {
        const match = formula.trim().match(diceRegex);
        if (!match) return null;

        const { groups } = match;
        return {
            count: groups.count ? parseInt(groups.count) : 1,
            sides: parseInt(groups.sides),
            keepDrop: groups.keepDrop?.toLowerCase() || null,
            keepDropCount: groups.keepDropCount ? parseInt(groups.keepDropCount) : null,
            reroll: groups.reroll?.toLowerCase() || null,
            rerollOp: groups.rerollOp || null,
            rerollVal: groups.rerollVal ? parseInt(groups.rerollVal) : null,
            explode: !!groups.explode,
            modOp: groups.modOp || null,
            modVal: groups.modVal ? parseInt(groups.modVal) : null
        };
    }

    /**
     * Validates a dice notation string
     * @param {string} formula - The dice notation to validate
     * @returns {boolean} - Whether the notation is valid
     */
    function validate(formula) {
        if (isDigitsOnly(formula)) return true;
        return diceRegex.test(formula.trim());
    }

    /**
     * Rolls dice according to the provided formula
     * @param {string} formula - The dice notation to roll
     * @returns {Object|boolean} - The roll result or false if invalid
     */
    function roll(formula) {
        // Handle single number case
        if (isDigitsOnly(formula)) {
            formula = `1d${formula}`;
        }

        const token = tokenize(formula);
        if (!token) return false;

        // Roll initial dice
        let rolls = Array(token.count).fill(0).map(() => rollDie(token.sides));
        let rerolledDice = [];
        let explodedDice = [];
        let keptDice = [...rolls];
        let droppedDice = [];

        // Handle rerolls
        if (token.reroll) {
            const rerollResult = handleRerolls(rolls, token.sides, token.reroll, token.rerollOp, token.rerollVal, token.explode);
            rolls = rerollResult.rolls;
            rerolledDice = rerollResult.rerolledDice;
        }

        // Handle exploding dice (if not already handled by rerolls)
        if (token.explode && !token.reroll) {
            const explosionResult = handleExploding(rolls, token.sides);
            rolls = explosionResult.rolls;
            explodedDice = explosionResult.explodedDice;
        }

        // Handle keep/drop
        if (token.keepDrop) {
            const keepDropResult = handleKeepDrop(rolls, token.keepDrop, token.keepDropCount);
            keptDice = keepDropResult.kept;
            droppedDice = keepDropResult.dropped;
            rolls = keptDice;
        }

        // Calculate total
        let total = rolls.reduce((sum, val) => sum + val, 0);

        // Apply modifier
        if (token.modOp === '+') {
            total += token.modVal;
        } else if (token.modOp === '-') {
            total -= token.modVal;
        }

        return {
            total,
            rolls: rolls.join(', '),
            formula,
            keptDice,
            droppedDice,
            rerolledDice,
            explodedDice
        };
    }
    
    /**
     * Rolls a single die
     * @param {number} sides - Number of sides on the die
     * @returns {number} - The roll result
     */
    function rollDie(sides) {
        return Math.floor(Math.random() * sides) + 1;
    }
    
    /**
     * Handles rerolling dice based on conditions
     * @param {number[]} rolls - The initial dice rolls
     * @param {number} sides - Number of sides on the die
     * @param {string} type - Reroll type (r, ro, rr)
     * @param {string} compare - Comparison operator (< or >)
     * @param {number} value - Value to compare against
     * @param {boolean} exploding - Whether dice are exploding
     * @returns {Object} - The modified rolls and rerolled dice
     */
    function handleRerolls(rolls, sides, type, compare, value, exploding) {
        const result = [...rolls];
        const rerolledDice = [];
        
        for (let i = 0; i < result.length; i++) {
            let shouldReroll = false;
            
            // Check if die should be rerolled
            if (compare === '<' && result[i] < value) {
                shouldReroll = true;
            } else if (compare === '>' && result[i] > value) {
                shouldReroll = true;
            }
            
            if (shouldReroll) {
                // Track the rerolled die
                rerolledDice.push(result[i]);
                
                // r: Reroll once
                if (type === 'r') {
                    result[i] = rollDie(sides);
                }
                // ro: Reroll once and keep the new value
                else if (type === 'ro') {
                    result[i] = rollDie(sides);
                }
                // rr: Reroll until condition is not met
                else if (type === 'rr') {
                    let newRoll;
                    do {
                        newRoll = rollDie(sides);
                        if (exploding && newRoll === sides) {
                            result.push(rollDie(sides));
                        }
                    } while ((compare === '<' && newRoll < value) || 
                             (compare === '>' && newRoll > value));
                    result[i] = newRoll;
                }
            }
        }
        
        return { rolls: result, rerolledDice };
    }
    
    /**
     * Handles exploding dice
     * @param {number[]} rolls - The initial dice rolls
     * @param {number} sides - Number of sides on the die
     * @returns {Object} - The modified rolls and exploded dice
     */
    function handleExploding(rolls, sides) {
        const result = [...rolls];
        const explodedDice = [];
        let i = 0;
        
        while (i < result.length) {
            if (result[i] === sides) {
                // Track the exploded die
                explodedDice.push(result[i]);
                
                const newRoll = rollDie(sides);
                result.push(newRoll);
            }
            i++;
        }
        
        return { rolls: result, explodedDice };
    }
    
    /**
     * Handles keeping or dropping dice
     * @param {number[]} rolls - The dice rolls
     * @param {string} type - Keep/drop type (k, kh, kl, d, dh, dl)
     * @param {number} count - Number of dice to keep/drop
     * @returns {Object} - The kept and dropped dice
     */
    function handleKeepDrop(rolls, type, count) {
        // Create copies of the rolls array
        const sortedRolls = [...rolls].sort((a, b) => b - a); // Descending
        let kept = [];
        let dropped = [];
        
        switch (type) {
            case 'k':
            case 'kh':
                // Keep highest
                kept = sortedRolls.slice(0, count);
                dropped = sortedRolls.slice(count);
                break;
            case 'kl':
                // Keep lowest
                kept = sortedRolls.slice(sortedRolls.length - count);
                dropped = sortedRolls.slice(0, sortedRolls.length - count);
                break;
            case 'd':
            case 'dh':
                // Drop highest
                kept = sortedRolls.slice(count);
                dropped = sortedRolls.slice(0, count);
                break;
            case 'dl':
                // Drop lowest
                kept = sortedRolls.slice(0, sortedRolls.length - count);
                dropped = sortedRolls.slice(sortedRolls.length - count);
                break;
            default:
                kept = rolls;
                dropped = [];
        }
        
        return { kept, dropped };
    }
    
    return {
        validate,
        roll
    };
})();

/**
 * Checks if a string contains only digits.
 * @param {string} str The string to check
 * @returns {boolean} True if the string contains only digits
 */
function isDigitsOnly(str) {
    return /^\d+$/.test(str);
}

/**
 * Returns a macro object for dice rolling.
 * @returns {Macro} Macro object with regex and replace function
 */
function getDiceRollMacro() {
    const rollPattern = /{{roll[ : ]([^}]+)}}/gi;
    const rollReplace = (match, matchValue) => {
        let formula = matchValue.trim();
        
        // Handle single number case
        if (isDigitsOnly(formula)) {
            formula = `1d${formula}`;
        }
        // Handle d20 case (no leading number)
        else if (formula.startsWith('d')) {
            formula = '1' + formula;
        }

        // Use droll's validation directly
        if (!droll.validate(formula)) {
            console.debug('Invalid dice formula:', matchValue);
            return '';
        }

        const result = droll.roll(formula);
        if (result === false) {
            console.debug('Roll failed for formula:', formula);
            return '';
        }

        return String(result.total);
    };

    return { regex: rollPattern, replace: rollReplace };
}

/**
 * Roll the dice.
 * @param {string} customDiceFormula Dice formula
 * @param {boolean} quiet Suppress chat output
 * @param {string} sendas How to send the message ('system', 'user', 'char', or null for quiet)
 * @returns {Promise<string>} Roll result
 */
async function doDiceRoll(customDiceFormula, quiet = true, sendas = 'system') {
    let value = typeof customDiceFormula === 'string' ? customDiceFormula.trim() : $(this).data('value');

    if (value == 'custom') {
        value = await callGenericPopup('Enter the dice formula:<br><i>(for example, <tt>2d6</tt>)</i>', POPUP_TYPE.INPUT, '', { okButton: 'Roll', cancelButton: 'Cancel' });
    }

    if (!value) {
        return '';
    }

    const isValid = droll.validate(value);

    if (isValid) {
        const result = droll.roll(value);
        if (!quiet) {
            const context = getContext();
            const message = `rolls ${value}. The result is: ${result.total} (${result.rolls})`;
            
            switch(sendas?.toLowerCase()) {
                case 'system':
                    context.sendSystemMessage('generic', `${context.name1} ${message}`, { isSmallSys: true });
                    break;
                case 'user':
                    context.sendMessageAsUser(`${context.name1} ${message}`);
                    break;
                case 'char':
                    context.addOneMessage({
                        mesType: 'char',
                        name: context.name2,
                        is_user: false,
                        is_system: false,
                        mes: message,
                        force_avatar: context.characterId,
                    });
                    break;
            }
        }
        return String(result.total);
    } else {
        toastr.warning('Invalid dice formula');
        return '';
    }
}

function addDiceRollButton() {
    const buttonHtml = `
    <div id="roll_dice" class="list-group-item flex-container flexGap5">
        <div class="fa-solid fa-dice extensionsMenuExtensionButton" title="Roll Dice" /></div>
        Roll Dice
    </div>
        `;
    const dropdownHtml = `
    <div id="dice_dropdown">
        <ul class="list-group">
            <li class="list-group-item" data-value="d4">d4</li>
            <li class="list-group-item" data-value="d6">d6</li>
            <li class="list-group-item" data-value="d8">d8</li>
            <li class="list-group-item" data-value="d10">d10</li>
            <li class="list-group-item" data-value="d12">d12</li>
            <li class="list-group-item" data-value="d20">d20</li>
            <li class="list-group-item" data-value="d100">d100</li>
            <li class="list-group-item" data-value="custom">...</li>
        </ul>
    </div>`;

    const getWandContainer = () => $(document.getElementById('dice_wand_container') ?? document.getElementById('extensionsMenu'));
    getWandContainer().append(buttonHtml);

    $(document.body).append(dropdownHtml);
    $('#dice_dropdown li').on('click', function () {
        dropdown.fadeOut(animation_duration);
        doDiceRoll($(this).data('value'), false);
    });
    const button = $('#roll_dice');
    const dropdown = $('#dice_dropdown');
    dropdown.hide();

    let popper = Popper.createPopper(button.get(0), dropdown.get(0), {
        placement: 'top',
    });

    $(document).on('click touchend', function (e) {
        const target = $(e.target);
        if (target.is(dropdown) || target.closest(dropdown).length) return;
        if (target.is(button) && !dropdown.is(':visible')) {
            e.preventDefault();

            dropdown.fadeIn(animation_duration);
            popper.update();
        } else {
            dropdown.fadeOut(animation_duration);
        }
    });
}

function registerFunctionTools() {
    try {
        const { registerFunctionTool } = getContext();
        if (!registerFunctionTool) {
            return;
        }

        const rollDiceSchema = Object.freeze({
            $schema: 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            properties: {
                who: {
                    type: 'string',
                    description: 'The name of the persona rolling the dice',
                },
                formula: {
                    type: 'string',
                    description: 'A dice formula to roll, e.g. 2d6, 4d6k3 (keep highest 3), 1d20r<2 (reroll 1s), 3d6! (exploding 6s)',
                },
                showDetails: {
                    type: 'boolean',
                    description: 'Whether to show detailed information about the roll (kept/dropped/rerolled dice)',
                    default: true
                }
            },
            required: [
                'who',
                'formula',
            ],
        });

        registerFunctionTool({
            name: 'RollTheDice',
            displayName: 'Dice Roll',
            description: 'Rolls dice using the provided formula and returns the result. Supports advanced notation like keeping highest/lowest (4d6k3), rerolling (1d20r<2), and exploding dice (3d6!). Use when determining random outcomes or when the user requests a dice roll.',
            parameters: rollDiceSchema,
            action: async (args) => {
                if (!args?.formula) args = { formula: '1d6' };
                const showDetails = args.showDetails !== false; // Default to true if not specified
                
                // Get the full roll result
                const result = droll.roll(args.formula);
                if (!result) return `Invalid dice formula: ${args.formula}`;
                
                let rollDescription = '';
                if (args.who) {
                    rollDescription = `${args.who} rolls ${args.formula}. `;
                }
                
                // Check if it's a complex roll
                const hasModifiers = /[kdr!<>]/i.test(args.formula);
                
                let rollMessage = '';
                if (hasModifiers) {
                    rollMessage = `${rollDescription}Result: ${result.total} [${result.rolls}]`;
                    
                    // Add details if requested
                    if (showDetails) {
                        // Add details about kept/dropped dice if applicable
                        if (result.keptDice && result.droppedDice && result.droppedDice.length > 0) {
                            rollMessage += `\nKept: [${result.keptDice.join(', ')}]\nDropped: [${result.droppedDice.join(', ')}]`;
                        }
                        // Add details about rerolled dice if applicable
                        else if (result.rerolledDice && result.rerolledDice.length > 0) {
                            rollMessage += `\nRerolled: [${result.rerolledDice.join(', ')}]`;
                        }
                        // Add details about exploded dice if applicable
                        else if (result.explodedDice && result.explodedDice.length > 0) {
                            rollMessage += `\nExploded: [${result.explodedDice.join(', ')}]`;
                        }
                    }
                } else {
                    rollMessage = `${rollDescription}The result is: ${result.total} (${result.rolls})`;
                }
                
                return rollMessage;
            },
            formatMessage: () => '',
        });
    } catch (error) {
        console.error('Error registering function tools:', error);
    }
}

jQuery(function () {
    addDiceRollButton();
    registerFunctionTools();
    
    // Register the dice roll macro with SillyTavern's macro system
    try {
        const { registerMacro } = getContext();
        if (registerMacro) {
            registerMacro(MODULE_NAME, {
                regex: /{{roll[ :]+([^}]+)}}/gi,
                replace: async (match, formula) => {
                    const originalFormula = formula;
                    formula = formula.trim().replace(/\s+/g, '');
                    // Preprocess formula: if it starts with 'd', add '1' in front
                    if (formula.startsWith('d')) {
                        formula = '1' + formula;
                    } else if (/^\d+$/.test(formula)) { // if formula is digits only, treat as number of sides
                        formula = `1d${formula}`;
                    }
                    
                    // Add debug logging
                    console.log(`Dice macro called with: "${originalFormula}", processed to: "${formula}"`);
                    const result = await doDiceRoll(formula, false, 'system'); // Send as system message
                    return result || match;
                }
            });
        }
    } catch (error) {
        console.error('Error registering macro:', error);
    }
    
    SlashCommandParser.addCommandObject(SlashCommand.fromProps({
        name: 'roll',
        aliases: ['r'],
        callback: (args, value) => {
            const quiet = args.quiet === undefined ? true : isTrueBoolean(String(args.quiet));
            const sendas = args.sendas || 'system';
            return doDiceRoll(String(value), quiet, sendas);
        },
        helpString: 'Roll the dice. By default quiet (no output). Use quiet=false to show in chat.',
        returns: 'roll result',
        namedArgumentList: [
            SlashCommandNamedArgument.fromProps({
                name: 'quiet',
                description: 'Control message display (default: true). Set to false to show in chat',
                isRequired: false,
                typeList: [ARGUMENT_TYPE.BOOLEAN],
                defaultValue: String(true),
                enumProvider: commonEnumProviders.boolean('trueFalse'),
            }),
            SlashCommandNamedArgument.fromProps({
                name: 'sendas',
                description: 'How to send the message:\n- "system" (small system message)\n- "user" (as user)\n- "char" (as current character)',
                isRequired: false,
                typeList: [ARGUMENT_TYPE.STRING],
                defaultValue: 'system',
                enumList: ['system', 'user', 'char'],
            }),
        ],
        unnamedArgumentList: [
            SlashCommandArgument.fromProps({
                description: 'dice formula, e.g. 2d6',
                isRequired: true,
                typeList: [ARGUMENT_TYPE.STRING],
            }),
        ],
    }));
});
