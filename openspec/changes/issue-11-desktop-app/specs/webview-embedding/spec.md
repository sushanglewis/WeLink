## ADDED Requirements

### Requirement: WebView container
The webview-embedding SHALL provide a container that loads the existing B/S pages for Chat, Contacts, and AI Sheets.

#### Scenario: WebView loads chat
- **WHEN** the user selects "Chat" in the sidebar
- **THEN** the WebView loads the existing B/S chat page

### Requirement: Visible separator
The webview-embedding SHALL render a visible separator between the sidebar and the WebView content area.

#### Scenario: Separator displayed
- **WHEN** the main interface is rendered
- **THEN** a separator exists between sidebar and WebView

### Requirement: Loading indicator
The webview-embedding SHALL display a loading indicator while the WebView page is loading.

#### Scenario: Loading state
- **WHEN** the user switches navigation and the WebView starts loading
- **THEN** a loading indicator is shown until the page loads

### Requirement: Error state
The webview-embedding SHALL display an error page with retry and back options when the WebView fails to load.

#### Scenario: Load failure
- **WHEN** the WebView fails to load a page
- **THEN** an error page with error code, retry button, and back navigation is shown

### Requirement: Page reload on navigation switch
The webview-embedding SHALL reload the corresponding B/S page each time the user switches navigation items.

#### Scenario: Switch reloads page
- **WHEN** the user switches from Chat to Contacts and back to Chat
- **THEN** the Chat WebView reloads the B/S chat page
