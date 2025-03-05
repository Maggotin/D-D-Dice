/**
 * Test file for the dice roll macro functionality.
 * This is for development purposes only and not part of the extension.
 */

// Mock droll object for testing
const droll = {
    validate: (formula) => {
        // Simple validation for testing
        return /^\d*d\d+([+-]\d+)?$/.test(formula);
    },
    roll: (formula) => {
        // Simple mock implementation for testing
        console.log(`Rolling ${formula}`);
        const match = formula.match(/^(\d*)d(\d+)([+-]\d+)?$/);
        if (!match) return false;
        
        const count = match[1] ? parseInt(match[1]) : 1;
        const sides = parseInt(match[2]);
        const modifier = match[3] ? parseInt(match[3]) : 0;
        
        // Mock roll result
        const rolls = Array(count).fill(0).map(() => Math.floor(Math.random() * sides) + 1);
        const total = rolls.reduce((sum, roll) => sum + roll, 0) + modifier;
        
        return {
            total,
            rolls: rolls.join(', ')
        };
    }
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
        "{{roll: invalid}}",
        "I roll {{roll: 2d6}} on my attack and deal {{roll:3d8+2}} damage."
    ];
    
    for (const testCase of testCases) {
        console.log(`\nTest case: "${testCase}"`);
        const result = testCase.replace(macro.regex, macro.replace);
        console.log(`Result: "${result}"`);
    }
}

// Run the test
testMacro();

console.log("\nTo run this test, use: node --experimental-modules test_macro.js"); 