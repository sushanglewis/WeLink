## ADDED Requirements

### Requirement: Application window management
The desktop-shell SHALL provide a main application window with customizable dimensions, maximize, minimize, and close behaviors.

#### Scenario: Window controls work
- **WHEN** the user clicks minimize, maximize, or close buttons
- **THEN** the window performs the corresponding action

### Requirement: Custom title bar
The desktop-shell SHALL render a custom title bar displaying the EAIC brand and native window controls.

#### Scenario: Title bar shows brand
- **WHEN** the user opens the application
- **THEN** the title bar displays the EAIC icon and application name without Mattermost branding

### Requirement: System tray integration
The desktop-shell SHALL provide a system tray icon with a context menu and the ability to show/hide the main window.

#### Scenario: Tray menu opens
- **WHEN** the user right-clicks the tray icon
- **THEN** a menu appears with options to open main window, settings, about, and quit

### Requirement: Auto-start support
The desktop-shell SHALL support configuring the application to start automatically on OS login.

#### Scenario: Auto-start toggle
- **WHEN** the user enables auto-start in system settings
- **THEN** the application registers to start on next OS login
