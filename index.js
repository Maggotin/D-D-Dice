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
        if (!quiet) {
            const context = getContext();
            context.sendSystemMessage('generic', `${context.name1} rolls a ${value}. The result is: ${result.total} (${result.rolls})`, { isSmallSys: true });
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

jQuery(function () {
    addDiceRollButton();
    registerFunctionTools();
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
