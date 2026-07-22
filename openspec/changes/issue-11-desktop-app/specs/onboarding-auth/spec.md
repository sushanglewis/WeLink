## ADDED Requirements

### Requirement: Onboarding wizard flow
The onboarding-auth SHALL present a two-step onboarding wizard: organization URL confirmation followed by enterprise credentials.

#### Scenario: First launch shows onboarding
- **WHEN** the application launches without a valid local token
- **THEN** the onboarding wizard is displayed

### Requirement: Organization URL pre-configuration
The onboarding-auth SHALL pre-fill the organization URL from the installer configuration while allowing the user to modify it.

#### Scenario: URL is pre-filled
- **WHEN** the user reaches the organization URL step
- **THEN** the URL is pre-filled and editable

### Requirement: Enterprise email and password login
The onboarding-auth SHALL authenticate users using the enterprise email and password synced to EAIC.

#### Scenario: Successful login
- **WHEN** the user enters valid enterprise email and password
- **THEN** the application obtains access token and refresh token and enters the main interface

### Requirement: Remember me
The onboarding-auth SHALL provide a "remember me" option checked by default that stores the refresh token for long-lived sessions.

#### Scenario: Remember me enabled
- **WHEN** the user logs in with "remember me" checked
- **THEN** the refresh token is persisted and reused on subsequent launches

### Requirement: Secure token storage
The onboarding-auth SHALL encrypt and store tokens using the OS credential store.

#### Scenario: Token is encrypted
- **WHEN** the application saves an access or refresh token
- **THEN** it is encrypted and stored in the OS keychain or equivalent
