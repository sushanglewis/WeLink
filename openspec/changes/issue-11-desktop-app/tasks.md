## 1. Project Setup

- [ ] 1.1 Initialize Tauri v2 project structure with Rust backend and Web frontend
- [ ] 1.2 Configure project metadata (app name EAIC, version, identifiers)
- [ ] 1.3 Set up development tooling (linting, formatting, TypeScript/Rust)
- [ ] 1.4 Configure CI pipeline skeleton for Windows and macOS builds

## 2. Desktop Shell

- [ ] 2.1 Implement main application window with default size 1280x800 and minimum size 1024x640
- [ ] 2.2 Implement custom title bar with EAIC branding and native window controls
- [ ] 2.3 Implement system tray icon with context menu (Open, Settings, About, Quit)
- [ ] 2.4 Implement window close behavior defaulting to minimize-to-tray
- [ ] 2.5 Implement auto-start configuration support

## 3. Onboarding and Authentication

- [ ] 3.1 Build onboarding wizard UI (organization URL step + credentials step)
- [ ] 3.2 Implement organization URL pre-fill from installer configuration with edit support
- [ ] 3.3 Implement enterprise email/password authentication against Mattermost API
- [ ] 3.4 Implement "remember me" default-checked with refresh token persistence
- [ ] 3.5 Implement secure token storage using OS credential store
- [ ] 3.6 Implement splash screen and automatic login when valid token exists
- [ ] 3.7 Implement login error handling with inline messages

## 4. Navigation Framework

- [ ] 4.1 Build left sidebar with Chat, Contacts, AI Sheets navigation items
- [ ] 4.2 Implement sidebar expand/collapse behavior (240px / 72px)
- [ ] 4.3 Implement unread count badges on navigation items
- [ ] 4.4 Implement bottom user info area (avatar, name, online status) with popup menu
- [ ] 4.5 Implement online status switching (online/away/do-not-disturb/offline)

## 5. WebView Embedding

- [ ] 5.1 Implement WebView container for loading existing B/S pages
- [ ] 5.2 Implement visible separator between sidebar and WebView content area
- [ ] 5.3 Implement loading indicator for WebView page transitions
- [ ] 5.4 Implement error page with error code, retry button, and back navigation
- [ ] 5.5 Implement navigation switching that reloads the corresponding B/S page

## 6. JS Bridge

- [ ] 6.1 Define JS Bridge protocol and message formats
- [ ] 6.2 Implement unread count forwarding from WebView to native sidebar and tray
- [ ] 6.3 Implement theme change propagation from native layer to WebView
- [ ] 6.4 Implement navigate-to-channel message handling for notification clicks
- [ ] 6.5 Add Bridge debugging utilities

## 7. Notification and Tray

- [ ] 7.1 Implement system notification for new messages when app is not focused
- [ ] 7.2 Implement notification click behavior (show app, switch to Chat, navigate to conversation)
- [ ] 7.3 Implement tray icon unread badge
- [ ] 7.4 Implement tray context menu actions

## 8. Settings Adaptation

- [ ] 8.1 Build settings modal with left category panel and right content area
- [ ] 8.2 Implement personal settings (avatar, full name, username read-only, email read-only)
- [ ] 8.3 Implement notification settings (desktop, sound, email, mention keywords)
- [ ] 8.4 Implement display settings (theme, language)
- [ ] 8.5 Implement security settings (change password)
- [ ] 8.6 Implement system settings (auto-start, minimize-to-tray, download path, language)
- [ ] 8.7 Implement advanced settings (cache cleanup)
- [ ] 8.8 Implement account settings (logout)
- [ ] 8.9 Implement immediate vs save-required change strategies

## 9. Branding Customization

- [ ] 9.1 Replace application icons for Windows and macOS
- [ ] 9.2 Implement splash screen with EAIC logo and application name
- [ ] 9.3 Implement About page with version, copyright, enterprise info, third-party licenses
- [ ] 9.4 Implement light/dark/follow-system theme modes for native UI
- [ ] 9.5 Ensure no visible Mattermost branding in window title, icons, or links

## 10. Packaging and Distribution

- [ ] 10.1 Configure Windows installer build (.exe and .msi)
- [ ] 10.2 Configure macOS installer build (.dmg and .pkg) for x64 and Apple Silicon
- [ ] 10.3 Configure code signing for Windows and macOS
- [ ] 10.4 Embed pre-configured server URL into installer
- [ ] 10.5 Set up internal distribution channel artifacts

## 11. Testing and Release

- [ ] 11.1 Write integration tests for login flow
- [ ] 11.2 Write integration tests for navigation and WebView loading
- [ ] 11.3 Write integration tests for notification and tray behavior
- [ ] 11.4 Perform Windows installation and smoke testing
- [ ] 11.5 Perform macOS installation and smoke testing
- [ ] 11.6 Document deployment and rollback procedures
