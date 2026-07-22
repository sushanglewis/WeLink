## ADDED Requirements

### Requirement: Settings modal
The settings-adaptation SHALL provide a modal settings window with a left navigation panel and right content area.

#### Scenario: Settings modal opens
- **WHEN** the user selects "Settings" from the avatar menu
- **THEN** a modal with left categories and right settings is displayed

### Requirement: Personal settings
The settings-adaptation SHALL provide personal settings for avatar, full name, notifications, display theme, and language.

#### Scenario: Personal settings accessible
- **WHEN** the user opens personal settings
- **THEN** the listed settings are editable or viewable according to their rules

### Requirement: System settings
The settings-adaptation SHALL provide system settings for auto-start, minimize-to-tray, download path, language, cache cleanup, and logout.

#### Scenario: System settings accessible
- **WHEN** the user opens system settings
- **THEN** the listed settings are editable

### Requirement: Immediate and save-required changes
The settings-adaptation SHALL apply theme, language, notification, and sound changes immediately, while requiring Save for avatar, full name, mention keywords, and password.

#### Scenario: Theme changes immediately
- **WHEN** the user changes the theme
- **THEN** the UI updates immediately without clicking Save
