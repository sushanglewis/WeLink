## ADDED Requirements

### Requirement: Left sidebar navigation
The navigation-framework SHALL render a left sidebar with primary navigation items: Chat, Contacts, and AI Sheets.

#### Scenario: Sidebar visible after login
- **WHEN** the user logs in successfully
- **THEN** the left sidebar with navigation items is displayed

### Requirement: Navigation order and default selection
The navigation-framework SHALL display items in the order Chat → Contacts → AI Sheets and default to Chat.

#### Scenario: Default to chat
- **WHEN** the user enters the main interface
- **THEN** "Chat" is selected by default

### Requirement: Collapsible sidebar
The navigation-framework SHALL support collapsing the sidebar to an icon-only mode.

#### Scenario: Collapse sidebar
- **WHEN** the user clicks the collapse button
- **THEN** the sidebar reduces to icon-only width

### Requirement: Unread badges
The navigation-framework SHALL display unread count badges on navigation items when reported by the WebView.

#### Scenario: Unread badge appears
- **WHEN** the WebView reports unread messages for a navigation item
- **THEN** a badge is shown on the corresponding sidebar item

### Requirement: User info area
The navigation-framework SHALL display the current user's avatar, name, and online status at the bottom of the sidebar.

#### Scenario: User info visible
- **WHEN** the user is logged in
- **THEN** the bottom of the sidebar shows avatar, name, and online status
