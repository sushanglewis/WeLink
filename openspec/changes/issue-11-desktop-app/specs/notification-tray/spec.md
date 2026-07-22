## ADDED Requirements

### Requirement: System notification for new messages
The notification-tray SHALL display a system notification when a new message arrives and the application is not in focus.

#### Scenario: New message notification
- **WHEN** a new message arrives while the app is not focused
- **THEN** a system notification is displayed with sender and message summary

### Requirement: Notification click navigates to conversation
The notification-tray SHALL bring the application to the foreground, switch to Chat, and navigate to the specific conversation when a notification is clicked.

#### Scenario: Click notification
- **WHEN** the user clicks a system notification
- **THEN** the app is shown, Chat is selected, and the corresponding conversation is focused

### Requirement: Tray unread badge
The notification-tray SHALL update the tray icon badge to reflect unread message count.

#### Scenario: Tray badge updated
- **WHEN** unread messages are reported
- **THEN** the tray icon shows a badge with the unread count

### Requirement: Tray context menu
The notification-tray SHALL provide a context menu with Open Main Window, Settings, About, and Quit.

#### Scenario: Tray menu actions
- **WHEN** the user selects an option from the tray menu
- **THEN** the corresponding action is executed
