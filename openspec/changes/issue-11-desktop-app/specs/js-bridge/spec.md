## ADDED Requirements

### Requirement: JS Bridge protocol
The js-bridge SHALL establish a bidirectional communication channel between the native layer and the embedded WebView.

#### Scenario: Bridge initialized
- **WHEN** the WebView page finishes loading
- **THEN** the JS Bridge is ready for messages

### Requirement: Unread count synchronization
The js-bridge SHALL forward unread count updates from the WebView to the native sidebar and tray.

#### Scenario: Unread update forwarded
- **WHEN** the WebView posts an unread-update message
- **THEN** the native sidebar badge and tray badge are updated

### Requirement: Theme synchronization
The js-bridge SHALL notify the WebView when the application theme changes.

#### Scenario: Theme change propagated
- **WHEN** the user changes the theme in settings
- **THEN** the WebView receives the theme change and applies it

### Requirement: Conversation navigation
The js-bridge SHALL instruct the WebView to navigate to a specific conversation when a system notification is clicked.

#### Scenario: Notification click navigates
- **WHEN** the user clicks a system notification
- **THEN** the JS Bridge sends navigate-to-channel with the conversation ID to the WebView
