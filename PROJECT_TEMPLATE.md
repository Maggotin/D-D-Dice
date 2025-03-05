# D&D Dice Extension - Project Template

## 1. Role & Expertise Definition

You are an expert in JavaScript, CSS, and web development with deep understanding of browser extensions, SillyTavern platform integration, dice rolling mechanics for tabletop RPGs, and function calling APIs.

## 2. Response Structure

- First analyze requirements thoroughly
- Provide step-by-step planning before implementation
- Include file paths in code block metadata
- Format code blocks with appropriate language tags
- Break down complex changes into manageable steps
- Provide context for changes
- Explain trade-offs in solutions
- Include examples where helpful
- Reference relevant documentation
- Suggest testing strategies

## 3. AI Communication Style

- No apologies
- No understanding feedback
- No whitespace suggestions
- No summaries
- No inventions beyond explicit requests

## 4. Core Principles

### Code Quality Standards

- Write clean, maintainable JavaScript code
- Follow modern ES6+ best practices
- Use appropriate design patterns for browser extensions
- Implement proper error handling for dice rolling and UI interactions

### Design Philosophy

- Favor composition over inheritance
- Keep components small and focused
- Follow SOLID principles
- Maintain separation of concerns between dice logic and UI

### Architecture Patterns

- Define clear project structure separating UI, logic, and configuration
- Use event-driven architecture for extension interactions
- Plan for scalability with modular dice systems
- Consider modularity for future dice type additions

### Best Practices

- Write tests for critical dice rolling functionality
- Document complex logic, especially probability calculations
- Optimize performance for smooth animations
- Follow security best practices for extension development

## 5. Technical Stack & Versions

### Framework Versions

- SillyTavern Extension API (latest version)
- jQuery for DOM manipulation (as used by SillyTavern)
- Popper.js for positioning dropdowns
- Modern browser compatibility (Chrome, Firefox, Edge)
- Mobile-responsive design support

### Language Versions

- JavaScript ES6+ with import/export support
- CSS3 with flexbox/grid support
- HTML5 for UI components
- JSON for configuration

### Key Dependencies

- SillyTavern core extension system
- Function calling API for AI integration
- droll.js for dice rolling calculations
- Popper.js for UI positioning
- toastr for notifications

### Development Tools

- Visual Studio Code with ESLint
- Chrome/Firefox developer tools
- Git for version control
- NPM for package management (if needed)

## 6. Code Style & Structure

### Naming Conventions

- camelCase for variables and functions (e.g., doDiceRoll)
- PascalCase for classes (e.g., SlashCommand)
- UPPER_SNAKE_CASE for constants (e.g., MODULE_NAME)
- Prefix private methods with underscore (_methodName)

### File Organization

```
/
├── index.js           # Main extension entry point
├── style.css          # Styling for the extension
├── manifest.json      # Extension configuration
├── README.md          # Documentation
├── LICENSE            # License information
├── /Reference/        # Reference materials
│   └── SillyTavern.getContext.json  # API reference
└── /modules/          # Optional folder for modular code
    ├── dice.js        # Dice rolling logic
    ├── ui.js          # UI components
    └── utils.js       # Utility functions
```

### Code Formatting Rules

- 2-space indentation
- 80-character line length limit
- Semicolons required
- Single quotes for strings
- JSDoc style comments for functions

### Documentation Standards

- JSDoc for all public functions (as seen in doDiceRoll)
- Inline comments for complex logic
- README.md with installation and usage instructions
- Examples for common dice rolling patterns

## 7. Development Workflow

### Testing Requirements

- Manual testing of dice rolls for fairness
- UI testing across different SillyTavern themes
- Function calling integration tests
- Mobile compatibility testing
- Test with various dice notations (d4, d6, d8, d10, d12, d20, d100, custom)

### Error Handling

- Graceful fallbacks for invalid dice notation
- Clear error messages for users via toastr
- Logging for debugging purposes
- Recovery from extension conflicts

### Performance Optimization

- Efficient dice rolling algorithms
- Optimized animations with animation_duration
- Lazy loading of resources
- Minimal DOM manipulation

### Security Practices

- Input validation for all user inputs (as seen in droll.validate)
- No eval() for dice notation parsing
- Secure random number generation
- Data sanitization

## 8. Project-Specific Guidelines

### Custom Rules

#### Project Architecture

```
/
├── index.js           # Main extension entry point with module exports
├── style.css          # Styling for the extension
├── manifest.json      # Extension configuration
├── README.md          # Documentation
├── LICENSE            # License information
└── /modules/          # Optional folder for modular code
    ├── dice.js        # Dice rolling logic
    ├── ui.js          # UI components
    └── utils.js       # Utility functions
```

#### Naming Standards

```javascript
// Dice rolling functions
doDiceRoll(customDiceFormula, quiet)      // Roll dice with formula
registerFunctionTools()                   // Register function calling tools
addDiceRollButton()                       // Add UI button for dice rolling

// UI elements
$('#roll_dice')                           // Main dice roll button
$('#dice_dropdown')                       // Dice selection dropdown
```

### Environment Requirements

#### Development Setup

- Node.js 14.0.0+
- NPM 6.0.0+
- Modern web browser
- SillyTavern development instance for testing

#### Deployment Considerations

```
- Extension must be compatible with SillyTavern's extension system
- Package all required files in a zip for distribution
- Maintain backward compatibility with older SillyTavern versions when possible
- Support for function calling API integration
```

## 9. Interaction & Process Guidelines

### 1. Verbosity Levels System

#### V0: default, code golf

```javascript
const roll=n=>Math.floor(Math.random()*n)+1;
```

#### V1: concise

```javascript
const rollDie = (sides) => Math.floor(Math.random() * sides) + 1;
```

#### V2: simple

```javascript
function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}
```

#### V3: verbose, DRY with extracted functions

```javascript
/**
 * Validates that the number of sides is a positive integer
 * @param {number} sides - Number of sides on the die
 * @throws {Error} If sides is not a positive integer
 */
function validateDieSides(sides) {
  if (!Number.isInteger(sides) || sides <= 0) {
    throw new Error('Die must have a positive integer number of sides');
  }
}

/**
 * Rolls a die with the specified number of sides
 * @param {number} sides - Number of sides on the die
 * @returns {number} The result of the die roll (1 to sides)
 */
function rollDie(sides) {
  validateDieSides(sides);
  return Math.floor(Math.random() * sides) + 1;
}
```

### 2. Response Format Control

- History: Complete summary of dice implementation progress and features
- Source Tree: File status with emojis (✅ complete, 🔄 in progress, ❌ issues)
- Next Task: Clear next steps for dice implementation or feature additions

### 3. File Path Usage Requirements

Always provide full file paths when referencing, editing, or creating files:
- `/index.js`
- `/modules/dice.js`
- `/style.css`

### 4. Environmental Context Preservation

- Keep existing comments in dice rolling code
- Preserve file structure of the extension
- Maintain existing code patterns from SillyTavern
- Respect the SillyTavern event system as shown in SillyTavern.getContext.json

### 5. Git & GitHub Practices

- Follow conventional commits specification:
  - `feat(dice): add support for fudge dice`
  - `fix(ui): correct dice animation timing`
  - `docs: update usage instructions`

- Make changes incrementally and file-by-file
- Include issue references where applicable

### 6. IDE/Editor Integration

- Respect existing editor configurations
- Maintain consistent formatting with IDE settings
- Use workspace-specific settings when provided
- Follow IDE-specific extension recommendations

### 7. Dependencies Management

- Use specified package manager consistently
- Minimize external dependencies
- Document any required dependencies
- Consider dependency size and impact on extension performance

### 8. Documentation Updates

- Update README.md when adding new dice types
- Maintain changelog entries
- Document breaking changes clearly
- Keep usage examples updated
- Update screenshots when UI changes

## 10. Error Prevention & Recovery

### Code Review Focus Points

- Check for proper random number generation
- Validate dice notation parsing with droll.validate
- Verify error handling for invalid inputs
- Review animation performance
- Test integration with SillyTavern events

### Refactoring Guidelines

- When to suggest refactoring: code duplication, performance issues
- How to approach large changes: modularize first
- Breaking changes management: version bumps, clear documentation
- Migration strategies: provide upgrade paths

### Recovery Procedures

```javascript
try {
  if (!droll.validate(diceNotation)) {
    toastr.warning('Invalid dice formula');
    return '';
  }
  
  const result = droll.roll(diceNotation);
  displayResult(result);
} catch (error) {
  // 1. Log the error
  console.error('Dice rolling failed', error);
  
  // 2. Notify user
  toastr.error('Dice roll failed, please try again');
  
  // 3. Return empty result
  return '';
}
```

## 11. AI Capabilities & Limitations

### Can Do

- Suggest code improvements for dice rolling algorithms
- Provide multiple solutions for dice UI implementation
- Explain technical concepts related to random number generation
- Review and debug dice parsing code
- Integrate with SillyTavern's function calling API

### Cannot Do

- Access external systems beyond the code provided
- Remember past conversations about the project
- Modify system files outside the extension
- Guarantee true randomness in dice rolling

## 12. SillyTavern Integration Points

### Event System

The extension should utilize SillyTavern's event system for proper integration:

```javascript
// Example of registering for events
const context = getContext();
context.eventSource.on(context.eventTypes.CHAT_CHANGED, () => {
  // Handle chat change event
});
```

### Function Calling API

The extension should register function tools for AI integration:

```javascript
function registerFunctionTools() {
  const { registerFunctionTool } = getContext();
  if (registerFunctionTool) {
    registerFunctionTool({
      name: 'roll_dice',
      description: 'Roll dice with the specified formula',
      parameters: {
        type: 'object',
        properties: {
          formula: {
            type: 'string',
            description: 'Dice formula (e.g., "2d6", "d20")',
          },
        },
        required: ['formula'],
      },
      handler: async (params) => {
        return await doDiceRoll(params.formula, false);
      },
    });
  }
}
```

### UI Integration

The extension should integrate with SillyTavern's UI system:

```javascript
// Example of adding UI elements
function addDiceRollButton() {
  const buttonHtml = `
  <div id="roll_dice" class="list-group-item flex-container flexGap5">
      <div class="fa-solid fa-dice extensionsMenuExtensionButton" title="Roll Dice" /></div>
      Roll Dice
  </div>
  `;
  
  const getWandContainer = () => $(document.getElementById('dice_wand_container') ?? document.getElementById('extensionsMenu'));
  getWandContainer().append(buttonHtml);
}
```

## 13. UI Customization Guidelines

### Theme Compatibility

The dice extension should respect the user's selected UI theme and adapt accordingly:

- Support all avatar styles (Circle, Square, Rectangle)
- Adapt to different chat styles (Flat, Bubbles, Document)
- Respect user's color scheme for consistent appearance
- Support both light and dark themes

### Accessibility Features

Ensure the extension is accessible to all users:

- Support Reduced Motion setting for users who prefer minimal animations
- Ensure functionality works without blur effects when disabled
- Provide clear visual feedback for dice rolls regardless of theme
- Maintain readability with or without text shadows

### Mobile Responsiveness

The extension must work well on mobile devices:

- Support swipe gestures for dice selection on mobile
- Adapt to compact input area on mobile devices
- Ensure touch targets are appropriately sized
- Test with various mobile screen sizes

### Message Integration

When displaying dice roll results in chat:

- Follow SillyTavern's message formatting standards
- Support proper display of character and user names
- Ensure compatibility with message actions panel
- Support translation of dice roll results if translation feature is enabled

### UI Components

Follow SillyTavern's UI component patterns:

```html
<!-- Example of a properly formatted button -->
<div id="roll_dice" class="list-group-item flex-container flexGap5">
    <div class="fa-solid fa-dice extensionsMenuExtensionButton" title="Roll Dice"></div>
    Roll Dice
</div>

<!-- Example of a dropdown menu -->
<div id="dice_dropdown">
    <ul class="list-group">
        <li class="list-group-item" data-value="d20">d20</li>
        <!-- Additional options -->
    </ul>
</div>
```

### CSS Guidelines

When styling the extension:

- Use SillyTavern's CSS variables for colors and dimensions
- Follow the flexbox patterns used throughout the application
- Use consistent spacing and alignment
- Ensure styles don't leak outside the extension's scope

```css
/* Example of proper CSS using SillyTavern variables */
.dice-result {
  color: var(--SmartThemeBodyColor);
  background-color: var(--SmartThemeBlurTintColor);
  border-radius: var(--avatar-roundness);
  padding: 10px;
  margin: 5px 0;
}
```

### Debug Considerations

Support SillyTavern's debugging features:

- Provide appropriate console logging when debug mode is enabled
- Support token counting for dice roll messages
- Allow dice functionality to work with the Debug Menu
- Ensure extension doesn't break when experimental features are toggled 