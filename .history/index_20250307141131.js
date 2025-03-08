import { animation_duration } from '../../../../script.js';
import { getContext } from '../../../extensions.js';
import { POPUP_TYPE, callGenericPopup } from '../../../popup.js';
import { SlashCommand } from '../../../slash-commands/SlashCommand.js';
import { ARGUMENT_TYPE, SlashCommandArgument, SlashCommandNamedArgument } from '../../../slash-commands/SlashCommandArgument.js';
import { commonEnumProviders } from '../../../slash-commands/SlashCommandCommonEnumsProvider.js';
import { SlashCommandParser } from '../../../slash-commands/SlashCommandParser.js';
import { isTrueBoolean } from '../../../utils.js';
export { MODULE_NAME };

const MODULE_NAME = 'dice';

// Add script tags for dependencies
function loadDependencies() {
    return new Promise((resolve, reject) => {
        const scripts = [
            'https://unpkg.com/mathjs@11.8.2/lib/browser/math.js',
            'https://cdn.jsdelivr.net/npm/random-js@2.1.0/dist/random-js.umd.min.js',
            'https://cdn.jsdelivr.net/npm/@dice-roller/rpg-dice-roller@5.3.0/lib/umd/bundle.min.js'
        ];
        
        let loaded = 0;
        scripts.forEach(src => {
            const script = document.createElement('script');
            script.src = src;
            script.async = false;
            script.onload = () => {
                loaded++;
                if (loaded === scripts.length) {
                    resolve();
                }
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    });
}

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
            new rpgDiceRoller.DiceRoll(formula);
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
            const diceRoll = new rpgDiceRoller.DiceRoll(formula);
            console.debug('Dice roll result:', diceRoll);
            
            // Extract detailed roll information
            const rollDetails = [];
            
            // Process each dice roll set
            diceRoll.rolls.forEach(rollSet => {
                if (Array.isArray(rollSet)) {
                    rollSet.forEach(roll => {
                        if (typeof roll === 'object') {
                            let rollText = String(roll.value);
                            if (roll.exploded) rollText += '!';
                            if (roll.dropped) rollText += 'd';
                            if (roll.rerolled) rollText += 'r';
                            rollDetails.push(rollText);
                        } else {
                            rollDetails.push(String(roll));
                        }
                    });
                } else if (typeof rollSet === 'number') {
                    rollDetails.push(String(rollSet));
                }
            });
            
            // Format to match the expected output format
            return {
                total: diceRoll.total,
                rolls: rollDetails.join(', '),
                formula: formula
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
 * Roll the dice.
 * @param {string} customDiceFormula Dice formula
 * @param {boolean} quiet Suppress chat output
 * @returns {Promise<string>} Roll result
 */
async function doDiceRoll(customDiceFormula, quiet = false) {
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
        if (!result) {
            return '[Roll failed]';
        }
        
        if (!quiet) {
            const context = getContext();
            context.sendSystemMessage('generic', `${context.name1} rolls a ${value}. The result is: ${result.total} (${result.rolls})`, { isSmallSys: true });
        }
        return `${result.total} (${result.rolls})`;
    } else {
        toastr.warning('Invalid dice formula');
        return '[Invalid dice formula]';
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
            console.debug('Dice: function tools are not supported');
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
                    description: 'A dice formula to roll, e.g. 2d6',
                },
            },
            required: [
                'who',
                'formula',
            ],
        });

        registerFunctionTool({
            name: 'RollTheDice',
            displayName: 'Dice Roll',
            description: 'Rolls the dice using the provided formula and returns the numeric result. Use when it is necessary to roll the dice to determine the outcome of an action or when the user requests it.',
            parameters: rollDiceSchema,
            action: async (args) => {
                if (!args?.formula) args = { formula: '1d6' };
                const roll = await doDiceRoll(args.formula, true);
                const result = args.who ? `${args.who} rolls a ${args.formula}. The result is: ${roll}` : `The result or a ${args.formula} roll is: ${roll}`;
                return result;
            },
            formatMessage: () => '',
        });
    } catch (error) {
        console.error('Dice: Error registering function tools', error);
    }
}

function registerMacros() {
    try {
        const { registerMacro } = getContext();
        if (!registerMacro) {
            console.debug('Dice: macros are not supported');
            return;
        }

        // Register the roll macro
        registerMacro('roll', {
            name: 'roll',
            description: 'Roll dice using various formats (e.g., {{roll:2d6}}, {{roll:4d6kh3}}, {{roll:2d20!}})',
            handler: async (args) => {
                if (!args?.trim()) {
                    return '[Invalid dice formula]';
                }
                
                const result = await doDiceRoll(args, true);
                if (!result) {
                    return '[Roll failed]';
                }
                
                return result;
            },
        });
    } catch (error) {
        console.error('Dice: Error registering macros', error);
    }
}

jQuery(async function () {
    try {
        await loadDependencies();
        addDiceRollButton();
        registerFunctionTools();
        registerMacros();
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
    } catch (error) {
        console.error('Failed to load D&D Dice extension:', error);
    }
});
