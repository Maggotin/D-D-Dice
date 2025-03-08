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
    // Regular expression for validating dice notation
    const diceRegex = /^(\d*)d(\d+)(?:(k|kh|kl|d|dh|dl)(\d+))?(?:(r|ro|rr)([<>])(\d+))?(!)?(?:([+-])(\d+))?$/i;
    
    /**
     * Validates a dice notation string
     * @param {string} formula - The dice notation to validate
     * @returns {boolean} - Whether the notation is valid
     */
    function validate(formula) {
        return diceRegex.test(formula);
    }
    
    /**
     * Rolls dice according to the provided formula
     * @param {string} formula - The dice notation to roll
     * @returns {Object|boolean} - The roll result or false if invalid
     */
    function roll(formula) {
        if (!validate(formula)) {
            return false;
        }
        
        const match = formula.match(diceRegex);
        if (!match) return false;
        
        // Extract dice parameters
        const count = match[1] ? parseInt(match[1]) : 1;
        const sides = parseInt(match[2]);
        const keepType = match[3] ? match[3].toLowerCase() : null;
        const keepCount = match[4] ? parseInt(match[4]) : null;
        const rerollType = match[5] ? match[5].toLowerCase() : null;
        const rerollCompare = match[6] || null;
        const rerollValue = match[7] ? parseInt(match[7]) : null;
        const exploding = match[8] === '!';
        const modifierType = match[9] || null;
        const modifierValue = match[10] ? parseInt(match[10]) : 0;
        
        // Roll the initial dice
        let rolls = [];
        for (let i = 0; i < count; i++) {
            rolls.push(rollDie(sides));
        }
        
        // Track rerolled dice
        let rerolledDice = [];
        
        // Handle rerolls
        if (rerollType) {
            const rerollResult = handleRerolls(rolls, sides, rerollType, rerollCompare, rerollValue, exploding);
            rolls = rerollResult.rolls;
            rerolledDice = rerollResult.rerolledDice;
        }
        
        // Track exploded dice
        let explodedDice = [];
        
        // Handle exploding dice (if not already handled by rerolls)
        if (exploding && !rerollType) {
            const explosionResult = handleExploding(rolls, sides);
            rolls = explosionResult.rolls;
            explodedDice = explosionResult.explodedDice;
        }
        
        // Track kept and dropped dice
        let keptDice = [...rolls];
        let droppedDice = [];
        
        // Handle keep/drop
        if (keepType) {
            const keepDropResult = handleKeepDrop(rolls, keepType, keepCount);
            keptDice = keepDropResult.kept;
            droppedDice = keepDropResult.dropped;
            rolls = keptDice; // Update rolls to only include kept dice
        }
        
        // Calculate total
        let total = rolls.reduce((sum, val) => sum + val, 0);
        
        // Apply modifier
        if (modifierType === '+') {
            total += modifierValue;
        } else if (modifierType === '-') {
            total -= modifierValue;
        }
        
        const result = {
            total: total,
            rolls: rolls.join(', '),
            formula: formula
        };
        
        // Add additional information for detailed output
        if (keepType) {
            result.keptDice = keptDice;
            result.droppedDice = droppedDice;
        }
        
        if (rerollType && rerolledDice.length > 0) {
            result.rerolledDice = rerolledDice;
        }
        
        if (exploding && explodedDice.length > 0) {
            result.explodedDice = explodedDice;
        }
        
        return result;
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
 * Validates different types of dice notation
 * @param {string} formula The dice formula to validate
 * @returns {string|false} Normalized formula if valid, false if invalid
 */
function validateAndNormalizeDiceFormula(formula) {
    // Basic dice notation: d20, 2d6
    const basicRegex = /^(\d*)d(\d+)$/i;
    
    // Modifier notation: 2d6+3, 1d20-2
    const modifierRegex = /^(\d*)d(\d+)([+-]\d+)$/i;
    
    // Keep/drop notation: 4d6k3, 2d20kh1, 3d6dl2
    const keepDropRegex = /^(\d*)d(\d+)(k|kh|kl|d|dh|dl)(\d+)$/i;
    
    // Reroll notation: 1d20r<2, 2d6ro>5
    const rerollRegex = /^(\d*)d(\d+)(r|ro|rr)([<>])(\d+)$/i;
    
    // Exploding dice: 3d6!, 2d8!
    const explodingRegex = /^(\d*)d(\d+)!$/i;

    // Single number (convert to 1dN)
    const singleNumberRegex = /^(\d+)$/;

    formula = formula.trim();

    // Test each pattern and normalize the formula
    if (singleNumberRegex.test(formula)) {
        return `1d${formula}`;
    }
    
    if (basicRegex.test(formula) || 
        modifierRegex.test(formula) || 
        keepDropRegex.test(formula) || 
        rerollRegex.test(formula) || 
        explodingRegex.test(formula)) {
        // If it matches any of our patterns, ensure the number of dice is specified
        if (formula.startsWith('d')) {
            return '1' + formula;
        }
        return formula;
    }

    return false;
}

/**
 * Returns a macro object for dice rolling.
 * @returns {Object} Macro object with regex and replace function
 */
function getDiceRollMacro() {
    const rollPattern = /{{roll[ : ]([^}]+)}}/gi;
    const rollReplace = (match, matchValue) => {
        const formula = validateAndNormalizeDiceFormula(matchValue);
        
        if (!formula) {
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
 * @returns {Promise<string>} Roll result
 */
async function doDiceRoll(customDiceFormula, quiet = false) {
    let value = typeof customDiceFormula === 'string' ? customDiceFormula.trim() : $(this).data('value');

    if (value == 'custom') {
        value = await callGenericPopup('Enter the dice formula:<br><i>(for example, <tt>2d6</tt>, <tt>4d6k3</tt>, <tt>1d20r<2</tt>, <tt>3d6!</tt>)</i>', POPUP_TYPE.INPUT, '', { okButton: 'Roll', cancelButton: 'Cancel' });
    }

    if (!value) {
        return '';
    }

    const isValid = droll.validate(value);

    if (isValid) {
        const result = droll.roll(value);
        if (!quiet) {
            const context = getContext();
            
            // Format the message based on the complexity of the roll
            let rollMessage = '';
            
            // Check if it's a complex roll (has special modifiers)
            const hasModifiers = /[kdr!<>]/i.test(value);
            
            if (hasModifiers) {
                rollMessage = `${context.name1} rolls ${value}. Result: ${result.total} [${result.rolls}]`;

                // Add details about kept/dropped dice if applicable
                if (result.keptDice && result.droppedDice && result.droppedDice.length > 0) {
                    rollMessage += ` (Kept: [${result.keptDice.join(', ')}], Dropped: [${result.droppedDice.join(', ')}])`;
                }
                // Add details about rerolled dice if applicable
                else if (result.rerolledDice && result.rerolledDice.length > 0) {
                    rollMessage += ` (Rerolled: [${result.rerolledDice.join(', ')}])`;
                }
                // Add details about exploded dice if applicable
                else if (result.explodedDice && result.explodedDice.length > 0) {
                    rollMessage += ` (Exploded: [${result.explodedDice.join(', ')}])`;
                }
            } else {
                rollMessage = `${context.name1} rolls ${value}. The result is: ${result.total} (${result.rolls})`;
            }

            // Use setTimeout to ensure the message is sent after the current execution context
            setTimeout(() => {
                try {
                    context.sendSystemMessage('generic', rollMessage, { isSmallSys: true });
                } catch (error) {
                    console.error('Dice: Error sending delayed system message', error);
                }
            }, 10);
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
            registerMacro(MODULE_NAME, getDiceRollMacro());
            
            // Add a global event listener for messages to ensure macros are processed
            $(document).on('click', '#send_but, #send_textarea', function() {
                const messageText = $('#send_textarea').val();
                if (messageText && messageText.includes('{{roll')) {
                    // Get the roll result
                    const matches = messageText.match(/{{roll[ : ]([^}]+)}}/gi);
                    if (matches) {
                        matches.forEach(match => {
                            const formula = match.replace(/{{roll[ : ]|}}/gi, '').trim();
                            // Display the roll in chat
                            doDiceRoll(formula, false);
                        });
                    }
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
            const quiet = isTrueBoolean(String(args.quiet));
            return doDiceRoll(String(value), quiet);
        },
        helpString: 'Roll the dice.',
        returns: 'roll result',
        namedArgumentList: [
            SlashCommandNamedArgument.fromProps({
                name: 'quiet',
                description: 'Do not display the result in chat',
                isRequired: false,
                typeList: [ARGUMENT_TYPE.BOOLEAN],
                defaultValue: String(false),
                enumProvider: commonEnumProviders.boolean('trueFalse'),
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
