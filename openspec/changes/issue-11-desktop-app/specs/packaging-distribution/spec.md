## ADDED Requirements

### Requirement: Windows installer
The packaging-distribution SHALL produce Windows installer packages in `.exe` and `.msi` formats.

#### Scenario: Windows installer builds
- **WHEN** the CI pipeline runs the Windows build
- **THEN** installable `.exe` and `.msi` artifacts are produced

### Requirement: macOS installer
The packaging-distribution SHALL produce macOS installer packages in `.dmg` and `.pkg` formats supporting both x64 and Apple Silicon.

#### Scenario: macOS installer builds
- **WHEN** the CI pipeline runs the macOS build
- **THEN** installable `.dmg` and `.pkg` artifacts are produced for both architectures

### Requirement: Code signing
The packaging-distribution SHALL sign Windows and macOS installers and application binaries with enterprise certificates.

#### Scenario: Signed artifacts
- **WHEN** the installers are built
- **THEN** they are signed and do not trigger OS security warnings

### Requirement: Pre-configured server URL
The packaging-distribution SHALL embed the enterprise server URL into the installer so users do not need to enter it manually.

#### Scenario: URL embedded
- **WHEN** the installer is created
- **THEN** the server URL is bundled in the application configuration

### Requirement: Internal distribution
The packaging-distribution SHALL support distribution through the enterprise internal network rather than public app stores.

#### Scenario: Internal download
- **WHEN** the build completes
- **THEN** artifacts are available for download from the enterprise internal channel
