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
     * @param {string} formula - The dice notation
     * @returns {Object|boolean} - The roll result or false if invalid
     */
    function roll(formula) {
        if (!validate(formula)) {
            return false;
        }
        
        const match = formula.match(diceRegex);
        if (!match) return false;
        
        const [
            , 
            countStr, 
            sidesStr, 
            keepType, 
            keepCountStr, 
            rerollType, 
            rerollCompare, 
            rerollValueStr, 
            exploding,
            modifierSign,
            modifierValueStr
        ] = match;
        
        // Parse basic dice parameters
        const count = countStr ? parseInt(countStr) : 1;
        const sides = parseInt(sidesStr);
        
        if (count <= 0 || sides <= 0) {
            return false;
        }
        
        // Roll the initial dice
        let rolls = [];
        for (let i = 0; i < count; i++) {
            rolls.push(rollDie(sides));
        }
        
        // Handle exploding dice (dice that generate additional rolls when they hit their maximum value)
        if (exploding) {
            rolls = handleExploding(rolls, sides);
        }
        
        // Handle rerolls if specified
        if (rerollType && rerollCompare && rerollValueStr) {
            const rerollValue = parseInt(rerollValueStr);
            rolls = handleRerolls(rolls, sides, rerollType, rerollCompare, rerollValue, exploding);
        }
        
        // Handle keep/drop if specified
        if (keepType && keepCountStr) {
            const keepCount = parseInt(keepCountStr);
            rolls = handleKeepDrop(rolls, keepType, keepCount);
        }
        
        // Calculate the total
        let total = rolls.reduce((sum, roll) => sum + roll, 0);
        
        // Apply modifier if specified
        if (modifierSign && modifierValueStr) {
            const modifierValue = parseInt(modifierValueStr);
            if (modifierSign === '+') {
                total += modifierValue;
            } else {
                total -= modifierValue;
            }
        }
        
        return {
            formula,
            rolls,
            total
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
     * @param {number[]} rolls - The current rolls
     * @param {number} sides - Number of sides on the die
     * @param {string} type - The reroll type (r, ro, rr)
     * @param {string} compare - The comparison operator (< or >)
     * @param {number} value - The value to compare against
     * @param {boolean} exploding - Whether the dice are exploding
     * @returns {number[]} - The updated rolls
     */
    function handleRerolls(rolls, sides, type, compare, value, exploding) {
        const rerolledDice = [];
        const result = [...rolls];
        
        // Process each roll
        for (let i = 0; i < result.length; i++) {
            let shouldReroll = false;
            
            // Check if the roll meets the reroll condition
            if (compare === '<' && result[i] < value) {
                shouldReroll = true;
            } else if (compare === '>' && result[i] > value) {
                shouldReroll = true;
            }
            
            // Reroll if condition is met
            if (shouldReroll) {
                rerolledDice.push(result[i]);
                
                // For 'r' (reroll once) and 'ro' (reroll once and only once)
                if (type.toLowerCase() === 'r' || type.toLowerCase() === 'ro') {
                    result[i] = rollDie(sides);
                }
                // For 'rr' (reroll recursively until condition is not met)
                else if (type.toLowerCase() === 'rr') {
                    let newRoll;
                    do {
                        newRoll = rollDie(sides);
                        if (exploding && newRoll === sides) {
                            // Handle exploding dice in recursive rerolls
                            const explosionRolls = handleExploding([newRoll], sides);
                            newRoll = explosionRolls.reduce((sum, r) => sum + r, 0);
                            break; // Exit the loop after handling explosion
                        }
                    } while ((compare === '<' && newRoll < value) || (compare === '>' && newRoll > value));
                    
                    result[i] = newRoll;
                }
            }
        }
        
        // Add rerolled dice to the result object for display
        result.rerolledDice = rerolledDice;
        
        return result;
    }
    
    /**
     * Handles exploding dice (dice that generate additional rolls when they hit their maximum value)
     * @param {number[]} rolls - The current rolls
     * @param {number} sides - Number of sides on the die
     * @returns {number[]} - The updated rolls with explosions
     */
    function handleExploding(rolls, sides) {
        const result = [...rolls];
        const explodedDice = [];
        
        // Check each die for explosion
        for (let i = 0; i < result.length; i++) {
            if (result[i] === sides) {
                let explosionCount = 0;
                let currentRoll = sides;
                
                // Continue rolling as long as we get the maximum value
                // Limit to 10 explosions to prevent infinite loops
                while (currentRoll === sides && explosionCount < 10) {
                    currentRoll = rollDie(sides);
                    explodedDice.push(currentRoll);
                    result.push(currentRoll);
                    explosionCount++;
                }
            }
        }
        
        // Add exploded dice to the result object for display
        result.explodedDice = explodedDice;
        
        return result;
    }
    
    /**
     * Handles keeping or dropping dice
     * @param {number[]} rolls - The current rolls
     * @param {string} type - The keep/drop type (k, kh, kl, d, dh, dl)
     * @param {number} count - The number of dice to keep/drop
     * @returns {number[]} - The updated rolls
     */
    function handleKeepDrop(rolls, type, count) {
        if (count <= 0 || count >= rolls.length) {
            return rolls;
        }
        
        // Create a copy of the rolls to sort
        const sortedRolls = [...rolls].sort((a, b) => a - b);
        const result = [...rolls];
        const keptDice = [];
        const droppedDice = [];
        
        // Process based on the type
        switch (type.toLowerCase()) {
            case 'k':
            case 'kh':
                // Keep highest
                for (let i = 0; i < rolls.length; i++) {
                    if (sortedRolls.slice(-count).includes(rolls[i])) {
                        keptDice.push(rolls[i]);
                    } else {
                        droppedDice.push(rolls[i]);
                        result[i] = 0; // Zero out dropped dice
                    }
                }
                break;
            case 'kl':
                // Keep lowest
                for (let i = 0; i < rolls.length; i++) {
                    if (sortedRolls.slice(0, count).includes(rolls[i])) {
                        keptDice.push(rolls[i]);
                    } else {
                        droppedDice.push(rolls[i]);
                        result[i] = 0; // Zero out dropped dice
                    }
                }
                break;
            case 'd':
            case 'dh':
                // Drop highest
                for (let i = 0; i < rolls.length; i++) {
                    if (sortedRolls.slice(-count).includes(rolls[i])) {
                        droppedDice.push(rolls[i]);
                        result[i] = 0; // Zero out dropped dice
                    } else {
                        keptDice.push(rolls[i]);
                    }
                }
                break;
            case 'dl':
                // Drop lowest
                for (let i = 0; i < rolls.length; i++) {
                    if (sortedRolls.slice(0, count).includes(rolls[i])) {
                        droppedDice.push(rolls[i]);
                        result[i] = 0; // Zero out dropped dice
                    } else {
                        keptDice.push(rolls[i]);
                    }
                }
                break;
        }
        
        // Add kept and dropped dice to the result object for display
        result.keptDice = keptDice;
        result.droppedDice = droppedDice;
        
        return result;
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
 * @returns {Object} Macro object with regex and replace function
 */
function getDiceRollMacro() {
    const rollPattern = /{{roll[ : ]([^}]+)}}/gi;
    const rollReplace = (match, matchValue) => { // match param is required by replacement function signature
        let formula = matchValue.trim();

        if (isDigitsOnly(formula)) {
            formula = `1d${formula}`;
        }

        // Check for advanced dice notation
        // This will handle notation like 2d6!, 4d6k3, 2d20r<2, etc.
        const isValid = droll.validate(formula);

        if (!isValid) {
            return '';
        }

        const result = droll.roll(formula);
        if (result === false) return '';
        
        // Display the roll in chat
        try {
            const context = getContext();
            const hasModifiers = /[kdr!<>]/i.test(formula);

            // Create a detailed message for the chat
            let rollMessage = '';
            if (hasModifiers) {
                rollMessage = `${context.name1} rolls ${formula}. Result: ${result.total} [${result.rolls}]`;

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
                rollMessage = `${context.name1} rolls ${formula}. The result is: ${result.total} (${result.rolls})`;
            }

            // Use setTimeout to ensure the message is sent after the current execution context
            setTimeout(() => {
                try {
                    context.sendSystemMessage('generic', rollMessage, { isSmallSys: true });
                } catch (error) {
                    console.error('Dice: Error sending delayed system message', error);
                }
            }, 10);
        } catch (error) {
            console.error('Dice: Error preparing system message for roll', error);
        }

        // For simple results, just return the total
        if (typeof result === 'object' && 'total' in result) {
            return String(result.total);
        }

        return String(result);
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
            
            context.sendSystemMessage('generic', rollMessage, { isSmallSys: true });
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
            // console.debug('Dice: function tools are not supported');
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
        // console.debug('Dice: function tools are not supported');
        console.error('Error registering function tools:', error);
    }
}

jQuery(function () {
    addDiceRollButton();
    
    try {
        registerFunctionTools();
    } catch (error) {
        console.error('Error initializing function tools:', error);
    }
    
    // Register the dice roll macro with SillyTavern's macro system
    try {
        const { registerMacro } = getContext();
        if (registerMacro) {
            const macro = getDiceRollMacro();
            registerMacro(MODULE_NAME, macro);
            
            // Add a global event listener for messages to ensure macros are processed
            $(document).on('click', '#send_but, #send_textarea', function() {
                const messageText = $('#send_textarea').val();
                if (messageText && messageText.includes('{{roll')) {
                }
            });
        } else {
            // console.debug('Dice: Macro registration not supported');
        }
    } catch (error) {
        console.error('Dice: Error registering macro', error);
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
