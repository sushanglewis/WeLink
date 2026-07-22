## ADDED Requirements

### Requirement: Application branding replacement
The branding-customization SHALL replace all visible Mattermost branding with EAIC branding in window title, icon, splash screen, and about page.

#### Scenario: No Mattermost branding visible
- **WHEN** the user opens the application
- **THEN** the title bar, splash, and about page show EAIC branding only

### Requirement: Splash screen
The branding-customization SHALL display a splash screen with the EAIC logo and application name on startup.

#### Scenario: Splash shown
- **WHEN** the application launches
- **THEN** a splash screen with EAIC logo and name is shown

### Requirement: About page
The branding-customization SHALL provide an About page with version, copyright, enterprise information, and third-party license notices.

#### Scenario: About page content
- **WHEN** the user opens About
- **THEN** version, copyright, enterprise info, and third-party licenses are displayed

### Requirement: Dark mode support
The branding-customization SHALL support light, dark, and follow-system theme modes for both native UI and WebView content.

#### Scenario: Dark mode applied
- **WHEN** the user selects dark theme
- **THEN** native UI and WebView both render in dark mode
