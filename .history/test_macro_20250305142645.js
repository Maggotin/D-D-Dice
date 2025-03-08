/**
 * Test file for the dice roll macro functionality.
 * This is for development purposes only and not part of the extension.
 */

// Mock droll object for testing
const droll = {
    validate: (formula) => {
        // Advanced validation for testing
        return /^(\d*)d(\d+)(?:(k|kh|kl|d|dh|dl)(\d+))?(?:(r|ro|rr)([<>])(\d+))?(!)?(?:([+-])(\d+))?$/i.test(formula);
    },
    roll: (formula) => {
        // Simple mock implementation for testing
        console.log(`Rolling ${formula}`);
        
        // Parse the formula
        const match = formula.match(/^(\d*)d(\d+)(?:(k|kh|kl|d|dh|dl)(\d+))?(?:(r|ro|rr)([<>])(\d+))?(!)?(?:([+-])(\d+))?$/i);
        if (!match) return false;
        
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
        
        // Mock roll result
        const rolls = Array(count).fill(0).map(() => Math.floor(Math.random() * sides) + 1);
        
        // Track kept/dropped dice
        let keptDice = [...rolls];
        let droppedDice = [];
        
        // Handle keep/drop
        if (keepType) {
            const sortedRolls = [...rolls].sort((a, b) => b - a); // Descending
            
            switch (keepType) {
                case 'k':
                case 'kh':
                    // Keep highest
                    keptDice = sortedRolls.slice(0, keepCount);
                    droppedDice = sortedRolls.slice(keepCount);
                    break;
                case 'kl':
                    // Keep lowest
                    keptDice = sortedRolls.slice(sortedRolls.length - keepCount);
                    droppedDice = sortedRolls.slice(0, sortedRolls.length - keepCount);
                    break;
                case 'd':
                case 'dh':
                    // Drop highest
                    keptDice = sortedRolls.slice(keepCount);
                    droppedDice = sortedRolls.slice(0, keepCount);
                    break;
                case 'dl':
                    // Drop lowest
                    keptDice = sortedRolls.slice(0, sortedRolls.length - keepCount);
                    droppedDice = sortedRolls.slice(sortedRolls.length - keepCount);
                    break;
            }
        }
        
        // Track rerolled dice
        let rerolledDice = [];
        
        // Simulate rerolls
        if (rerollType) {
            for (let i = 0; i < rolls.length; i++) {
                let shouldReroll = false;
                
                // Check if die should be rerolled
                if (rerollCompare === '<' && rolls[i] < rerollValue) {
                    shouldReroll = true;
                    rerolledDice.push(rolls[i]);
                } else if (rerollCompare === '>' && rolls[i] > rerollValue) {
                    shouldReroll = true;
                    rerolledDice.push(rolls[i]);
                }
            }
        }
        
        // Track exploded dice
        let explodedDice = [];
        
        // Simulate explosions
        if (exploding) {
            for (let i = 0; i < rolls.length; i++) {
                if (rolls[i] === sides) {
                    explodedDice.push(rolls[i]);
                }
            }
        }
        
        // Apply modifiers (simplified for testing)
        let total = keptDice.reduce((sum, roll) => sum + roll, 0);
        if (modifierType === '+') {
            total += modifierValue;
        } else if (modifierType === '-') {
            total -= modifierValue;
        }
        
        const result = {
            total,
            rolls: keptDice.join(', '),
            formula
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
};

// Mock getContext for testing
const getContext = () => {
    return {
        name1: 'TestUser',
        sendSystemMessage: (type, message, options) => {
            console.log(`System Message (${type}): ${message}`);
        }
    };
};

// Import the getDiceRollMacro function
import { getDiceRollMacro } from './index.js';

// Test the macro
function testMacro() {
    const macro = getDiceRollMacro();
    
    // Test cases
    const testCases = [
        "{{roll: 2d6}}",
        "{{roll:1d20+5}}",
        "{{roll:20}}",
        "{{roll: 4d6k3}}",
        "{{roll: 1d20r<2}}",
        "{{roll: 3d6!}}",
        "{{roll: 2d20kl1}}",
        "{{roll: invalid}}",
        "I roll {{roll: 2d6}} on my attack and deal {{roll:3d8+2}} damage. If I roll a {{roll:1d20}} of 20, it's a critical hit!"
    ];
    
    for (const testCase of testCases) {
        console.log(`\nTest case: "${testCase}"`);
        const result = testCase.replace(macro.regex, macro.replace);
        console.log(`Result: "${result}"`);
        console.log('---');
    }
}

// Run the test
testMacro();

console.log("\nTo run this test, use: node --experimental-modules test_macro.js"); 