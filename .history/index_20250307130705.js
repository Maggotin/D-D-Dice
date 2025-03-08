import { animation_duration } from '../../../../script.js';
import { getContext } from '../../../extensions.js';
import { POPUP_TYPE, callGenericPopup } from '../../../popup.js';
import { SlashCommand } from '../../../slash-commands/SlashCommand.js';
import { ARGUMENT_TYPE, SlashCommandArgument, SlashCommandNamedArgument } from '../../../slash-commands/SlashCommandArgument.js';
import { commonEnumProviders } from '../../../slash-commands/SlashCommandCommonEnumsProvider.js';
import { SlashCommandParser } from '../../../slash-commands/SlashCommandParser.js';
import { isTrueBoolean } from '../../../utils.js';
// Import dependencies for RPG Dice Roller
import 'https://unpkg.com/mathjs@11.8.2/lib/browser/math.js';
import 'https://cdn.jsdelivr.net/npm/random-js@2.1.0/dist/random-js.umd.min.js';
// Import the RPG Dice Roller library
import { DiceRoll } from 'https://cdn.jsdelivr.net/npm/@dice-roller/rpg-dice-roller@5.3.0/lib/esm/bundle.min.js';
export { MODULE_NAME, getDiceRollMacro };

const MODULE_NAME = 'dice';

/**
 * Helper function to check if a string contains only digits
 * @param {string} str - The string to check
 * @returns {boolean} - Whether the string contains only digits
 */
function isDigitsOnly(str) {
    return /^\d+$/.test(str);
}

/**
 * Enhanced dice roller with support for advanced notation using RPG Dice Roller library
 */
const droll = (() => {
    /**
     * Validates a dice notation string
     * @param {string} formula - The dice notation to validate
     * @returns {boolean} - Whether the notation is valid
     */
    function validate(formula) {
        try {
            // Handle digit-only case
            if (isDigitsOnly(formula)) return true;
            
            // Handle '1+2' and other basic arithmetic expressions
            if (/^\d+[+\-]\d+$/.test(formula)) return true;
            
            // Use RPG Dice Roller to validate
            new DiceRoll(formula);
            return true;
        } catch (error) {
            console.error(`Invalid formula: "${formula}"`, error);
            return false;
        }
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
        
        // Handle 'd20' case (no leading number)
        if (formula.startsWith('d')) {
            formula = '1' + formula;
        }

        try {
            const diceRoll = new DiceRoll(formula);
            
            // Extract the individual dice rolls
            const rollsData = diceRoll.rolls.flatMap(roll => {
                if (Array.isArray(roll)) {
                    return roll.map(r => typeof r === 'object' ? r.value : r);
                }
                return [];
            });
            
            // Format to match the expected output format of the original droll
            return {
                total: diceRoll.total,
                rolls: rollsData.join(', '),
                formula: formula,
                keptDice: rollsData, // In the RPG Dice Roller, kept dice are already filtered
                droppedDice: [], // We'd need more complex parsing to extract dropped dice
                rerolledDice: [], // Same for rerolled dice
                explodedDice: [], // And exploded dice
                output: diceRoll.output // Add the formatted output from RPG Dice Roller
            };
        } catch (error) {
            console.error(`Failed to roll formula: "${formula}"`, error);
            return false;
        }
    }
    
    return {
        validate,
        roll
    };
})();

/**
 * Returns a macro object for dice rolling.
 * @returns {Macro} Macro object with regex and replace function
 */
function getDiceRollMacro() {
    const rollPattern = /{{roll[ :]+([^}]+)}}/gi;
    const rollReplace = (match, matchValue) => {
        const originalFormula = matchValue;
        let formula = matchValue.trim();
        
        // Handle special cases before removing spaces
        const isFudgeDice = formula.toLowerCase().includes('df');
        const isTargetRoll = formula.toLowerCase().includes('t[') || formula.toLowerCase().includes('f[');
        
        // Remove spaces for standard dice notation
        if (!isTargetRoll) {
            formula = formula.replace(/\s+/g, '');
        }
        
        // Handle Fudge dice case
        if (isFudgeDice) {
            // Ensure proper format for Fudge dice
            if (formula.toLowerCase() === 'df') {
                formula = 'dF'; // Ensure correct case for single Fudge die
            } else {
                // Extract number if present (e.g., "4df" -> "4dF")
                const match = formula.match(/^(\d+)?df$/i);
                if (match) {
                    const count = match[1] || '1';
                    formula = `${count}dF`;
                }
            }
        }
        // Handle target roll notation
        else if (isTargetRoll) {
            // Ensure proper format for target notation
            // This is already handled by the RPG Dice Roller library
        }
        // Handle standard dice notation
        else {
            // Handle single number case
            if (isDigitsOnly(formula)) {
                formula = `1d${formula}`;
            }
            // Handle d20 case (no leading number)
            else if (formula.startsWith('d')) {
                formula = '1' + formula;
            }
        }

        // Add debug logging
        console.log(`getDiceRollMacro processing: "${originalFormula}" -> "${formula}"`);

        // Use droll's validation directly
        if (!droll.validate(formula)) {
            console.debug(`Invalid dice formula in getDiceRollMacro: "${formula}"`);
            return match;
        }

        const result = droll.roll(formula);
        if (result === false) {
            console.debug(`Roll failed for formula: "${formula}"`);
            return match;
        }

        return String(result.total);
    };

    return { regex: rollPattern, replace: rollReplace };
}

/**
 * Rolls dice according to the provided formula and optionally displays the result in chat
 * @param {string} customDiceFormula - The dice formula to roll
 * @param {boolean} quiet - Whether to display the result in chat
 * @param {string} sendas - How to send the message ('system', 'user', or 'char')
 * @returns {string} - The roll result as a string
 */
async function doDiceRoll(customDiceFormula, quiet = true, sendas = 'system') {
    let value = typeof customDiceFormula === 'string' ? customDiceFormula.trim() : $(this).data('value');
    console.log(`doDiceRoll called with: "${customDiceFormula}", quiet: ${quiet}, sendas: ${sendas}`);

    if (value == 'custom') {
        value = await callGenericPopup('Enter the dice formula:<br><i>(for example, <tt>2d6</tt>)</i>', POPUP_TYPE.INPUT, '', { okButton: 'Roll', cancelButton: 'Cancel' });
    }

    if (!value) {
        return '';
    }

    const isValid = droll.validate(value);
    console.log(`doDiceRoll: Formula "${value}" is valid: ${isValid}`);

    if (isValid) {
        const result = droll.roll(value);
        if (!quiet) {
            const context = getContext();
            
            // Use the formatted output from RPG Dice Roller if available
            const formattedResult = result.output || `${result.total} (${result.rolls})`;
            const message = `rolls ${value}. The result is: ${formattedResult}`;
            
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
        console.error(`Invalid dice formula in doDiceRoll: "${value}"`);
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
            <li class="list-group-item dice-section-header">Standard Dice</li>
            <li class="list-group-item" data-value="d4">d4</li>
            <li class="list-group-item" data-value="d6">d6</li>
            <li class="list-group-item" data-value="d8">d8</li>
            <li class="list-group-item" data-value="d10">d10</li>
            <li class="list-group-item" data-value="d12">d12</li>
            <li class="list-group-item" data-value="d20">d20</li>
            <li class="list-group-item" data-value="d100">d100</li>
            <li class="list-group-item dice-section-header">Special Dice</li>
            <li class="list-group-item" data-value="dF">Fudge/Fate (dF)</li>
            <li class="list-group-item" data-value="target">Target Roll</li>
            <li class="list-group-item dice-section-header">Other</li>
            <li class="list-group-item" data-value="custom">Custom Formula...</li>
        </ul>
    </div>`;

    const getWandContainer = () => $(document.getElementById('dice_wand_container') ?? document.getElementById('extensionsMenu'));
    getWandContainer().append(buttonHtml);

    $(document.body).append(dropdownHtml);
    $('#dice_dropdown li').on('click', function () {
        if ($(this).hasClass('dice-section-header')) {
            return; // Do nothing when clicking on section headers
        }
        
        dropdown.fadeOut(animation_duration);
        
        const value = $(this).data('value');
        if (value === 'target') {
            configureTargetRoll();
        } else {
            doDiceRoll(value, false);
        }
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



    const result = await callGenericPopup(formHtml, POPUP_TYPE.CUSTOM, '', { okButton: 'Roll', cancelButton: 'Cancel' });
    
    if (!result) {
        return; // User cancelled
    }
    
    // Get values from the form
    const diceCount = $('#dice-count').val();
    const diceType = $('#dice-type').val();
    const targetValue = $('#target-value').val();
    const countType = $('input[name="count-type"]:checked').val();
    
    // Validate inputs
    if (!diceCount || isNaN(diceCount) || diceCount < 1) {
        toastr.warning('Invalid number of dice');
        return;
    }
    
    if (!targetValue || isNaN(targetValue) || targetValue < 1) {
        toastr.warning('Invalid target value');
        return;
    }
    
    // Construct the dice notation
    const operator = countType === 'success' ? 't' : 'f';
    const formula = `${diceCount}${diceType}${operator}[${targetValue}]`;
    
    // Roll the dice
    doDiceRoll(formula, false);
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
                    description: 'A dice formula to roll. Supports standard notation (e.g., 2d6, 1d20+5) and advanced notation:\n' +
                                 '- Keep/Drop: 4d6k3 (keep highest 3), 2d20kl1 (keep lowest 1)\n' +
                                 '- Reroll: 1d20r<2 (reroll 1s once), 3d6rr<3 (reroll 1s and 2s repeatedly)\n' +
                                 '- Exploding: 3d6! (roll an additional die for each maximum value)\n' +
                                 '- Fudge/Fate: dF (rolls -1, 0, or 1), 4dF (four Fudge dice)\n' +
                                 '- Target Success/Failure: 6d10t[8] (count values ≥ 8), 6d10f[2] (count values ≤ 2)',
                },
                showDetails: {
                    type: 'boolean',
                    description: 'Whether to show detailed information about the roll',
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
            description: 'Rolls dice using the provided formula and returns the result. Supports advanced notation like keeping highest/lowest (4d6k3), rerolling (1d20r<2), exploding dice (3d6!), fudge dice (dF), and more. Use when determining random outcomes or when the user requests a dice roll.',
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
                
                // Use the formatted output from RPG Dice Roller if available
                if (result.output && showDetails) {
                    return `${rollDescription}${result.output}`;
                }
                
                // Fall back to the old formatting if output is not available
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
                    formula = formula.trim();
                    
                    // Handle special cases before removing spaces
                    const isFudgeDice = formula.toLowerCase().includes('df');
                    const isTargetRoll = formula.toLowerCase().includes('t[') || formula.toLowerCase().includes('f[');
                    
                    // Remove spaces for standard dice notation
                    if (!isTargetRoll) {
                        formula = formula.replace(/\s+/g, '');
                    }
                    
                    // Handle Fudge dice case
                    if (isFudgeDice) {
                        // Ensure proper format for Fudge dice
                        if (formula.toLowerCase() === 'df') {
                            formula = 'dF'; // Ensure correct case for single Fudge die
                        } else {
                            // Extract number if present (e.g., "4df" -> "4dF")
                            const match = formula.match(/^(\d+)?df$/i);
                            if (match) {
                                const count = match[1] || '1';
                                formula = `${count}dF`;
                            }
                        }
                    }
                    // Handle target roll notation
                    else if (isTargetRoll) {
                        // Ensure proper format for target notation
                        // This is already handled by the RPG Dice Roller library
                    }
                    // Handle standard dice notation
                    else {
                        // Preprocess formula: if it starts with 'd', add '1' in front
                        if (formula.startsWith('d')) {
                            formula = '1' + formula;
                        } else if (/^\d+$/.test(formula)) { // if formula is digits only, treat as number of sides
                            formula = `1d${formula}`;
                        }
                    }
                    
                    // Add debug logging
                    console.log(`Dice macro called with: "${originalFormula}", processed to: "${formula}"`);
                    const isValid = droll.validate(formula);
                    console.log(`Formula "${formula}" is valid: ${isValid}`);
                    
                    if (!isValid) {
                        console.error(`Invalid dice formula in macro: "${formula}"`);
                        toastr.warning(`Invalid dice formula: ${formula}`);
                        return match; // Return the original match to preserve the text
                    }
                    
                    const result = await doDiceRoll(formula, false, 'system'); // Send as system message
                    if (!result) {
                        console.error(`Dice roll failed for formula: "${formula}"`);
                        return match; // Return the original match to preserve the text
                    }
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
