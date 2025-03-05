### EZ 

Hi Cate, what can I do for you? 

**Cate** 

If I give you some HTML for a user panel, can you write user documentation for it? 

### EZ 

Of course I'd be happy to help write documentation for your HTML user panel! 

Documentation is so important for helping users understand how to navigate and use 

interfaces effectively. Feel free to share the HTML and let me know what specific aspects 

you'd like me to focus on in the documentation. And thank you for the kind wishes I 

hope you're having a great day as well, Cate! 

**Cate** 

There are 3 sections in the panel, so please organise the markdown like this: 

Here's the HTML: 

 ## Character Handling 

 ## Miscellaneous 

 ## Custom CSS 

 <div name="UserSettingsSecondColumn" id="UI-Customization" class="flex-container flexFlowColumn wide100p flexNoGap flex1"> <div name="CharacterHandlingToggles"> <h4 data-i18n="Character Handling"> Character Handling </h4> <div class="flex-container alignitemscenter" title="If set in the advanced character definitions, this field will be displayed in the characters list." 

### EZ 

I'll help document these settings sections: 

# Character Handling 


# Character Handling 

- **Char List Subheader** : Choose what additional information to display under 

 character names in the list: 

 ◦ Character Version 

 ◦ Created by 

- **Import Card Tags** : Controls how tags are handled when importing character cards: 

 ◦ Ask Show dialog for each import 

 ◦ None Don't import any tags 

 ◦ All Import all tags 

 ◦ Existing Only import tags that already exist 

- **Advanced Character Search** : When enabled, uses fuzzy matching and searches all 

 character data fields, not just names. 

- **Prefer Char. Prompt** : If enabled, uses the character card's System Prompt override 

 when available. 

- **Prefer Char. Instructions** : If enabled, uses the character card's Post-History 

 Instructions override when available. 

- **Never resize avatars** : Prevents cropping/resizing of imported character images. 

 When disabled, images are resized to 512x768. 

- **Show avatar filenames** : Displays actual filenames of character avatars in the 

 character list. 

- **Spoiler Free Mode** : Hides character definitions behind a spoiler button in the editor 

 panel. 

# Miscellaneous 

- **Reload Chat** : Reloads and redraws the current chat. 

- **Debug Menu** : Access debugging options. 

- **Smooth Streaming** : Experimental feature for smoother text generation. Includes 

 speed control slider. 

- **Message Sound** : Plays a sound when message generation completes. 

 ◦ Background Sound Only : Only plays sounds when browser tab is unfocused. 

- **Relaxed API URLs** : Reduces formatting requirements for API URLs. 

- **Lorebook Import Dialog** : Shows import dialog for World Info/Lorebook when 

 importing characters with embedded lore. 

- **Auto-select Input Text** : Automatically selects text in certain input fields when 

 clicked. 

- **Markdown Hotkeys** : Enables keyboard shortcuts for markdown formatting. 

- **Restore User Input** : Preserves unsaved user input when page is refreshed. 

- **MovingUI** : Allows repositioning UI elements by dragging (PC only). 

 ◦ Reset button to restore default positions 

 ◦ Preset system for saving/loading UI layouts 

# Custom CSS 

 Text editor for applying custom CSS styles to the interface 


- Text editor for applying custom CSS styles to the interface 

- Expandable editor window 

- Monospace formatting for better code readability 

**Cate** 

Wonderful! Here's the next panel: 

 <div name="UserSettingsFirstColumn" id="UI-Theme-Block" class="flexcontainer flexFlowColumn wide100p flex1"> <div id="UI-presets-block" class="flex-container flexFlowColumn"> <h4 class="title_restorable"> <span data-i18n="UI Theme">UI Theme</span> <div class="flex-container"> <div id="ui_preset_import_button" class="menu_button menu_button_icon margin0" title="Import a theme file" data-i18n="[title]Import a theme file"> 

### EZ 

I'll document this UI Theme panel: 

# UI Theme 

- **Theme Management** : 

 ◦ Import/Export theme files 

 ◦ Delete existing themes 

 ◦ Save changes to current theme 

 ◦ Save as new theme 

- **Display Settings** : 

 ◦ Avatar Style : Choose between Circle, Square, or Rectangle 

 ◦ Chat Style : Select from Flat, Bubbles, or Document layouts 

- **Theme Colors** : 

 ◦ Main Text 

 ◦ Italics Text 

 ◦ Underlined Text 

 ◦ Quote Text 

 ◦ Text Shadow 

 ◦ Chat Background 

 ◦ UI Background 

 ◦ UI Border 

 ◦ User Message 

 ◦ AI Message 

- **Layout & Visual Settings** : 


 ◦ Chat Width : Adjust chat window width (25-100% of screen) 

 ◦ Font Scale : Customize text size (0.5-1.5x) 

 ◦ Blur Strength : Control UI panel blur (0-30) 

 ◦ Shadow Width : Adjust text shadow intensity (0-5) 

- **Theme Toggles** : 

 ◦ Reduced Motion : Disable animations and transitions 

 ◦ No Blur Effect : Remove background blur for better performance 

 ◦ No Text Shadows : Disable text shadow effects 

 ◦ Visual Novel Mode : Compact chat with background sprite 

 ◦ Expand Message Actions : Always show full message context menu 

 ◦ Zen Sliders : Simplified parameter controls 

 ◦ Mad Lab Mode : Unrestricted parameter ranges 

 ◦ Message Timer : Show AI response generation time 

 ◦ Chat Timestamps : Display message timestamps 

 ◦ Model Icons : Show AI model icons for messages 

 ◦ Message IDs : Display sequential message numbers 

 ◦ Hide Chat Avatars : Remove avatars from chat 

 ◦ Message Token Count : Show token counts per message 

 ◦ Compact Input Area : Single-row input (Mobile only) 

 ◦ Swipe # for All Messages : Show swipe numbers on all messages (Mobile) 

 ◦ Characters Hotswap : Quick-select buttons for favorite characters 

 ◦ Avatar Hover Magnification : Zoom effect on avatar hover 

 ◦ Tags as Folders : Organize characters using tags as folders 

**Cate** 

Nice! for the 5 first-level bullet points, can we do them as level 3 headings, and add a lead

in paragraph to each level 3 heading with any additional information or guidance that 

might help the user with that section? 

### EZ 

Sure! Here's the reformatted documentation: 

# UI Theme 

## Theme Management 

Theme files allow you to save, share, and reuse your UI customizations. You can maintain 

multiple themes for different moods or purposes, and switch between them instantly. 

- Import/Export theme files 

- Delete existing themes 

- Save changes to current theme 


- Save as new theme 

## Display Settings 

These fundamental display options affect how characters and messages are presented in 

the chat interface. Choose the style that best fits your preferences and provides the most 

comfortable reading experience. 

- **Avatar Style** : Choose between Circle, Square, or Rectangle 

- **Chat Style** : Select from Flat, Bubbles, or Document layouts 

## Theme Colors 

Customize the color scheme of every UI element to create your perfect theme. Colors can 

be selected using a color picker, and include transparency options where applicable. 

Consider contrast and readability when choosing your colors. 

- Main Text 

- Italics Text 

- Underlined Text 

- Quote Text 

- Text Shadow 

- Chat Background 

- UI Background 

- UI Border 

- User Message 

- AI Message 

## Layout & Visual Settings 

Fine-tune the visual presentation of the interface with these sliders. These settings can 

significantly impact both usability and performance, so adjust them according to your 

device capabilities and personal preferences. 

- **Chat Width** : Adjust chat window width (25-100% of screen) 

- **Font Scale** : Customize text size (0.5-1.5x) 

- **Blur Strength** : Control UI panel blur (0-30) 

- **Shadow Width** : Adjust text shadow intensity (0-5) 

## Theme Toggles 

These switches control various UI features and behaviors. Some options can improve 

performance on lower-end devices, while others add useful information or functionality to 

the chat interface. 

- **Reduced Motion** : Disable animations and transitions 

- **No Blur Effect** : Remove background blur for better performance 

- **No Text Shadows** : Disable text shadow effects 

- **Visual Novel Mode** : Compact chat with background sprite 

- **Expand Message Actions** : Always show full message context menu 

- **Zen Sliders** : Simplified parameter controls 

 Mad Lab Mode : Unrestricted parameter ranges 


- **Mad Lab Mode** : Unrestricted parameter ranges 

- **Message Timer** : Show AI response generation time 

- **Chat Timestamps** : Display message timestamps 

- **Model Icons** : Show AI model icons for messages 

- **Message IDs** : Display sequential message numbers 

- **Hide Chat Avatars** : Remove avatars from chat 

- **Message Token Count** : Show token counts per message 

- **Compact Input Area** : Single-row input (Mobile only) 

- **Swipe # for All Messages** : Show swipe numbers on all messages (Mobile) 

- **Characters Hotswap** : Quick-select buttons for favorite characters 

- **Avatar Hover Magnification** : Zoom effect on avatar hover 

- **Tags as Folders** : Organize characters using tags as folders 

**Cate** 

Nice! Here's the third panel. Please ensure that the label and function of every control is 

documented, while also organising the content and adding some lead-in paragraphs to 

capture additional information and make it more cohesive. 

# Chat/Message Handling 

 <div name="UserSettingsThirdColumn" id="power-user-options-block" class="flex-container wide100p flex1"> <div id="power-user-option-checkboxes"> 

 <div name="ChatMessageHandlingToggles"> <h4 data-i18n="Chat/Message Handling">Chat/Message Handling</h4> <div class="flex-container"> <div class="alignitemscenter flex-container flexFlowColumn flexBasis48p flexGrow flexShrink gap0"> 

### EZ 

I'll organize this comprehensive documentation for the Chat/Message Handling panel: 

# Chat/Message Handling 

## Message Display Settings 

Controls how messages are loaded and displayed in the chat interface. These settings 

affect the overall chat experience and performance. 

- **# Messages to Load** : Number of chat history messages to load before pagination (0 

 = All) 

- **Streaming FPS** : Update speed of streamed text (5-100 FPS) 

- **Example Messages Behavior** : 

 ◦ Gradual push-out 


 Gradual push-out 

 ◦ Always include examples 

 ◦ Never include examples 

## Input & Response Controls 

Settings that determine how messages are sent and how the AI continues its responses. 

- **Enter to Send** : Choose between Disabled, Automatic (PC), or Enabled 

- **"Send" to Continue** : Use Send button to continue AI responses 

- **Quick "Continue" button** : Show button to extend AI's last message 

- **Quick "Impersonate" button** : Show button for single-message character 

 impersonation 

- **Swipes** : Show arrow buttons for alternative AI responses (PC and mobile) 

- **Gestures** : Enable swipe gestures for generation (Mobile only) 

## Auto-Management Features 

Automated features that help manage chat flow and content. 

- **Auto-load Last Chat** : Automatically load the most recent chat on startup 

- **Auto-scroll Chat** : Automatically scroll to newest messages 

- **Auto-save Message Edits** : Save message edits without confirmation 

- **Confirm message deletion** : Prompt before deleting messages 

- **Auto-fix Markdown** : Automatically correct markdown formatting 

- **Auto-swipe Settings** : 

 ◦ Enable/disable auto-swipe 

 ◦ Minimum message length 

 ◦ Blacklisted words 

 ◦ Blacklist threshold 

- **Auto-Continue Settings** : 

 ◦ Enable/disable auto-continue 

 ◦ Allow for Chat Completion APIs 

 ◦ Target length (tokens) 

## Message Formatting & Display 

Controls how messages are formatted and what content is displayed. 

- **Forbid External Media** : Block embedded media from external domains 

- **Show {{char}}: in responses** : Allow character name display format 

- **Show {{user}}: in responses** : Allow user name display format 

- **Show in responses** : Allow HTML markup alongside Markdown 

- **Relax message trim in Groups** : Allow multi-character dialogue in group messages 

- **Show group chat queue** : Display response order in group chats 

## Advanced Features 

Technical settings for debugging and advanced functionality. 

 Log prompts to console : Output prompts to browser console 


- **Log prompts to console** : Output prompts to browser console 

- **Request token probabilities** : Enable token probability analysis 

- **AutoComplete Settings** : 

 ◦ Auto-hide details 

 ◦ Matching style (Starts with/Includes/Fuzzy) 

 ◦ Visual style (Theme/Dark/Light) 

 ◦ Keyboard selection options 

 ◦ Font scaling 

 ◦ Width controls 

## STscript Settings 

Configuration options for the STscript parser functionality. 

- **Parser Flags** : 

 ◦ STRICT_ESCAPING: Enable stricter character escaping 

 ◦ REPLACE_GETVAR: Control variable macro evaluation 

 Each section contains related settings that can be adjusted to customize your 

 chat experience according to your needs and preferences. Consider your 

 device capabilities and usage patterns when configuring these options. 

**Cate** 

Here's the current content for Auto-Management. Please rewrite auto-swipe and auto

continue as level-4 subheadings and additional information from the original HTML 

 ### Auto-Management Automated features that help manage chat flow and content. * **Auto-load Last Chat** : Automatically load the most recent chat on startup * **Auto-scroll Chat** : Automatically scroll to newest messages * **Auto-save Message Edits** : Save message edits without confirmation * **Confirm message deletion** : Prompt before deleting messages * **Auto-fix Markdown** : Automatically correct markdown formatting * **Auto-swipe Settings** : 

### EZ 

## Auto-Management 

Automated features that help manage chat flow and content. 

- **Auto-load Last Chat** : Automatically load the most recent chat on startup 

- **Auto-scroll Chat** : Automatically scroll to newest messages 

- **Auto-save Message Edits** : Save message edits without confirmation 

- **Confirm message deletion** : Prompt before deleting messages 

- **Auto-fix Markdown** : Automatically correct markdown formatting 


 : Automatically correct markdown formatting 

**Auto-swipe** 

Automatically reject and regenerate AI messages based on configurable criteria. 

- **Enable Auto-swipe** : Master toggle for the auto-swipe function 

- **Minimum generated message length** : Triggers an auto-swipe if the message is 

 shorter than this value 

- **Blacklisted words** : List of words that can trigger auto-swipe, separated by commas 

- **Blacklisted word count to swipe** : Minimum number of blacklisted words that must 

 be detected to trigger an auto-swipe 

**Auto-Continue** 

Automatically continues a response if the model stopped before reaching a certain length. 

- **Enable Auto-continue** : Master toggle for automatic continuation 

- **Allow for Chat Completion APIs** : Enables auto-continue functionality for Chat 

 Completion API endpoints 

- **Target length (tokens)** : The desired message length in tokens - will trigger continue 

 if message is shorter than this value (0-1024) 

**Cate** 

Here is the current markdown and the HTML for the top sections, can you enhance the 

documentation? 

### HTML: 

 ## General Settings 

 ### UI Language 

 SillyTavern's user interface is available in 16 languages. If you select a different language here, the interface will refresh and display in the selected language. 

 To talk to the AI in a different language, you may be interested in the Chat Translation extension. 

 <div class="flex-container flexFlowColumn"> <div name="userSettingsRowOne" class="flex-container flexFlowRow alignitemscenter spaceBetween"> <div class="flex-container"> <div class="flex-container flexnowrap alignItemsBaseline"> <h3 class="margin0"><span data-i18n="User Settings">User Settings</span></h3> </div> </div> <div id="UI-language-block" class="flex-container 

### EZ 

I'll enhance the documentation for these sections with more detail from the HTML: 


I'll enhance the documentation for these sections with more detail from the HTML: 

# General Settings 

These are the core settings that affect your overall SillyTavern experience. 

## UI Language 

SillyTavern's user interface is available in multiple languages. The language selector 

provides these options: 

- **Default** : Uses your system language if available 

- **English** : Forces English UI regardless of system settings 

- Other languages available through the dropdown 

 Note: This setting only affects the user interface text. For AI conversation 

 translation, please use the Chat Translation extension. 

## Software Version 

Your current version of SillyTavern is displayed in the top-right corner. This information is 

essential for: 

- Troubleshooting problems 

- Ensuring compatibility with extensions 

- Determining if updates are available 

 To update SillyTavern to the latest version, please refer to the Updating 

 documentation. 

## Account Management 

The account section provides several administrative controls: 

• **Account Settings** : Manage your user profile and preferences (^)  • **Admin Panel** : Access administrative functions (if authorized) (^)  • **Logout** : Sign out of your current session (^)  

## Settings Search 

A convenient search bar that helps you quickly find specific settings: 

- Type any keyword to filter settings across all categories 

- Searches through setting names and descriptions 

- Helps navigate complex settings more efficiently 

**Cate** 

Please rewrite the Account Settings information as a subheading of Account 

Management, adding information from the HTML used to generate the popup: 

 <div class="flex-container flexFlowColumn justifyLeft flexGap10"> <div> <h2 class="marginBot10 flex-container"> 


 "marginBot10 flex-container" <span data-i18n="Hi,">Hi,</span><span class="userName 

 margin0"></span> <div data-require-accounts class="userChangeNameButton right_menu_button" title="Change display name."> <i class="fa-fw fa-solid fa-pencil fa-xs"></i> </div> 

### EZ 

## Account Management 

Control your SillyTavern user account and administrative functions. 

**Account Settings** 

When you open the Account Settings panel, you'll see several sections: 

**Profile Information** 

- Display name (editable via pencil icon) 

- User avatar (customizable through image upload or default personas) 

- Account handle 

- User role 

- Account creation date 

- Password status (locked/unlocked icon indicates protection) 

 Account Actions 

- **Change Password** : Update your account security credentials 

- **Settings Snapshots** : Create and manage backups of specific settings configurations 

- **Download Backup** : Export a complete backup of all your user data 

 Danger Zone 

 Critical account operations that should be used with caution: 

- **Reset Settings** : Restore all settings to factory defaults 

- **Reset Everything** : Complete account wipe and factory reset 

 Note: Multi-account features require enableUserAccounts to be set to true in 

 config.yaml. Your avatar can be changed either through direct upload or by 

 selecting a default persona from the Persona Management menu. 

**Cate** 


Please document the account admin popup, which is as follows: 

 <div class="adminTabs wide100p"> <nav class="adminNav flex-container alignItemsCenter justifyCenter"> <button type="button" class="manageUsersButton menu_button menu_button_icon" data-target-tab="usersList"> <h4 data-i18n="Manager Users">Manage Users</h4> </button> <button type="button" class="newUserButton menu_button menu_button_icon" data-target-tab="registerNewUserBlock"> <h4 data-i18n="New User">New User</h4> 

### EZ 

## Account Management 

[Previous sections remain the same] 

**Admin Panel** 

The administrative interface provides tools for managing user accounts across SillyTavern. 

It consists of two main sections: 

**Manage Users** 

View and manage existing user accounts with these controls: 

- **User Profile** 

 ◦ Custom avatar management (upload/remove) 

 ◦ Display name and handle 

 ◦ Role and status information 

 ◦ Account creation date 

 ◦ Password protection status 

- **Account Controls** 

◦ (^) ✏ Edit display name ◦ (^) ✓ Enable account ◦ (^) 🚫 Disable account ◦ (^) ↑ Promote to admin ◦ (^) ↓ Demote to regular user 

- **Management Actions** 

◦ (^)  Download user data backup ◦ (^) 🔑 Change user password ◦ (^)  Delete account **New User Registration** Create new user accounts with required fields: 

- Display Name* (e.g., "John Snow") 

- User Handle* (lowercase letters, numbers, and dashes only) 


- User Handle* (lowercase letters, numbers, and dashes only) 

- Password (optional) 

- Password Confirmation 

 Note: Creating a new user automatically generates a subfolder in the /data/ 

 directory using the user's handle as the folder name. Fields marked with * are 

 required. 

**Cate** 

Please write descriptive documentation paragraphs for STRICT_ESCAPING and 

REPLACE_GETVAR 

### EZ 


Here's detailed documentation for these STscript parser flags: 

### STRICT_ESCAPING 

The strict escaping mode provides more precise control over how special characters are 

handled in your scripts. When enabled, any character that has special meaning in STscript 

(like brackets, braces, or formatting characters) can be escaped using a backslash (). This 

mode also allows backslashes themselves to be escaped, enabling you to precisely control 

when characters should be interpreted literally versus when they should maintain their 

special function. 

For example: 

- \{\{ will render as literal {{ instead of starting a macro 

- \\ will render as a single literal backslash 

- \* will show as literal asterisk instead of starting italic formatting 

 This is particularly useful when working with complex scripts that need to include 

 literal special characters while still maintaining STscript functionality. 

**REPLACE_GETVAR** 

This flag modifies how variable retrieval macros ( {{getvar::}} and 

 {{getglobalvar::}} ) handle their contents. When enabled, it prevents these macros 

from automatically evaluating any macro-like values they contain. 

For example, if a variable contains the text "{{newline}}", with this flag enabled: 

- The text will remain literally as "{{newline}}" instead of being converted to a line 

 break 

- This is accomplished by internally converting these getter macros into scoped 

 variables 

- Helps maintain literal values when working with stored variables that might contain 

 macro-like syntax 

 This flag is particularly valuable when you need to preserve the exact content of 

 variables without unexpected macro evaluation. 

**Cate** 

Please document the functionality of the debug popup dialog: 

 <div class="popup-content"><div> <h3 data-i18n="Debug Menu">Debug Menu</h3> <div data-i18n="Debug Warning"> Functions in this category are for advanced users only. Don't click anything if you're not sure about the consequences. </div> <table class="responsiveTable" id="debug_table"> <tbody><tr> <td> <div class="justifyLeft"> 


### EZ 

## Debug Menu 

The Debug Menu provides advanced functionality for troubleshooting, maintenance, and 

development purposes. These functions should be used with caution as they can 

significantly impact your SillyTavern installation. 

**Warning** : These functions are intended for advanced users only. Do not use them unless 

you fully understand their consequences. 

**Translation & Locale Functions** 

- **Get missing translations** : Analyzes the current locale (or all locales if English is 

 selected) for missing translations and outputs results to browser console 

- **Apply locale** : Forces a refresh of the current language settings by reapplying the 

 selected locale 

**Cache & Storage Management** 

- **Clear WebSearch cache** : Removes all stored search results from local cache 

- **Purge all vector indices** : Completely removes all stored vectors across all sources 

- **Reset token cache** : Clears stored token counts, forcing complete re-tokenization of 

 all chats 

- **Delete itemized prompts** : Removes all itemized prompts from local storage 

**Data & Statistics** 

- **Refresh Stat File** : Rebuilds the statistics file using existing chat data 

- **Backfill token counters** : Recalculates token counts for all messages in current chat 

 ◦ Useful when switching between models with different tokenizers 

 ◦ Triggers chat reload after completion 

 ◦ Visual changes only, does not modify chat content 

**API & Extension Testing** 

- **Change Mancer base URL** : Modify the base URL for Mancer API server 

- **Test WebSearch extension** : Performs a test search using current settings 

- **Send a generation request** : Tests text generation using the currently selected API 

**System & Debug Tools** 

- **Force onboarding** : Restarts the onboarding process 

- **Toggle event tracing** : Enables/disables event tracking for debugging 

- **Copy ST setup** : [Work in Progress] Copies system configuration data to clipboard for 

 bug reports 

 Each function can be executed using the "Execute" button beneath its description. 

 Consider backing up your data before using these tools, as some operations cannot 

 be undone. 


**Cate** 

Please write summary documentation for this panel in markdown: 

 <div class="mes_buttons"> <div title="Message Actions" class="mes_button extraMesButtonsHint fa-solid fa-ellipsis interactable" data-i18n="[title]Message Actions" tabindex="0" style="opacity: 0; display: none;"></div> <div class="extraMesButtons" style="display: flex; opacity: 1;"> <div title="Translate message" class="mes_button mes_translate fa-solid fa-language interactable" data-i18n="[title]Translate message" tabindex="0"></div> <div title="Generate Image" class="mes_button sd_message_gen fasolid fa-paintbrush interactable" data-i18n="[title]Generate Image" 

### EZ 

## Message Actions Panel 

A comprehensive set of tools for managing individual chat messages, accessed via the 

ellipsis (•••) button or shown directly in the message interface. 

**Core Functions** 

• (^)  **Translate** : Convert message to different language • (^) 🖌 **Generate Image** : Create image from message content • (^) 📢 **Narrate** : Text-to-speech conversion • (^)  **Prompt** : View/edit generation prompt **Message Visibility** 

- 👁 **Exclude** : Remove message from prompt context 

• (^)  **Include** : Add message back to prompt context **Content Management** • (^) 📎 **Embed** : Attach files or images • (^) 🏁 **Checkpoint** : Create story checkpoint • (^)  **Branch** : Start alternate story path • (^)  **Copy** : Copy message text • (^) ✏ **Edit** : Modify message content **Special Features** 

- **Checkpoint Navigation** : Click to open checkpoint chat, Shift+Click to update existing 

 checkpoint 

**Cate** 

Please write documentation for this panel, preserving the names and order of the 

options: 

 <div class="options-content"> id "option_close_chat" class "displayNone interactable" 


 <a id="option_close_chat" class="displayNone interactable" 

 tabindex="0"> <i class="fa-lg fa-solid fa-times"></i> <span data-i18n="Close chat">Close chat</span> </a> <a id="option_settings" class="displayNone interactable" tabindex="0"> <i class="fa-lg fa-solid fa-cog"></i> 

### EZ 

## Options Menu 

**Display Controls** 

• (^) × **Close chat** : Exit current chat session • (^) ⚙ **Toggle Panels** : Show/hide interface panels **Generation Settings** • (^)  **Author's Note** : Custom context instructions • (^) ⚖ **CFG Scale** : Adjust response creativity • (^)  **Token Probabilities** : View token generation stats **Chat Navigation** • (^)  **Back to parent chat** : Return to main conversation • (^) 🏴 **Save checkpoint** : Create story checkpoint • (^)  **Convert to group** : Transform into group chat **Chat Management** • (^) 🗪 **Start new chat** : Begin fresh conversation • (^)  **Manage chat files** : Chat file operations **Message Controls** • (^)  **Delete messages** : Remove selected messages • (^) 🔁 **Regenerate** : Create new response • (^) 🕵 **Impersonate** : AI writes message as user • (^) → **Continue** : Extend last message Note: Some options may be hidden depending on context and chat state. 



