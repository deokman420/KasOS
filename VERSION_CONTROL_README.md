# KasOS Version Control System

## Overview

The KasOS Version Control System provides comprehensive version tracking, build management, and GitHub integration for the KasOS desktop environment. It supports semantic versioning, component tracking, build automation, and deployment management.

## Features

### Core Version Management
- **Semantic Versioning**: MAJOR.MINOR.PATCH format with prerelease support
- **Build Tracking**: Unique build IDs, timestamps, and commit hashes
- **Environment Detection**: Automatic detection of development, staging, and production environments
- **Component Versioning**: Track individual application and module versions

### GitHub Integration
- **Release Management**: Automated GitHub release creation
- **Update Checking**: Check for latest releases from GitHub
- **API Integration**: Full GitHub API support for repository operations
- **CI/CD Ready**: GitHub Actions workflow templates included

### Build System
- **Automated Builds**: PowerShell and Node.js build scripts
- **Version Increment**: Automatic version bumping (major/minor/patch)
- **Git Integration**: Automatic commit hash and branch detection
- **Package Generation**: Automatic package.json creation and updates

## Files

### Core Files
- `version-control.js` - Main version control system
- `version-display.js` - UI components for version display
- `build.js` - Node.js build script (requires Node.js)
- `build.ps1` - PowerShell build script (Windows native)

### Generated Files
- `package.json` - Generated package information
- `.github/workflows/build.yml` - GitHub Actions workflow (auto-generated)

## Usage

### Basic Version Information

```javascript
// Get current version
const version = window.KasOSVersionControl.getVersionString();
console.log(version); // "1.3.0"

// Get full version information
const info = window.KasOSVersionControl.getVersionInfo();
console.log(info);
```

### Version Display Components

```javascript
// Create a version badge
const badge = window.KasOSVersionDisplay.createVersionBadge({
    showCodename: true,
    showEnvironment: true,
    compact: false
});
document.body.appendChild(badge);

// Show version modal
window.KasOSVersionDisplay.showVersionModal();
```

### Build Scripts

#### PowerShell (Windows)
```powershell
# Basic build (patch increment)
.\build.ps1

# Major version increment
.\build.ps1 major

# Dry run (test without changes)
.\build.ps1 -DryRun

# Production build with specific environment
.\build.ps1 -Environment production

# Build with specific commit and branch
.\build.ps1 -Commit abc123 -Branch main
```

#### Node.js (Cross-platform)
```bash
# Basic build
node build.js

# Version increment with options
node build.js patch --env production

# Dry run
node build.js --dry-run

# Skip git operations
node build.js --no-git
```

## Version Control API

### Core Methods

#### `KasOSVersionControl.init()`
Initialize the version control system. Called automatically on page load.

#### `KasOSVersionControl.getVersionString(includePrerelease, includeBuild)`
Get formatted version string.
- `includePrerelease` (boolean): Include prerelease suffix
- `includeBuild` (boolean): Include build number

#### `KasOSVersionControl.getVersionInfo()`
Get complete version information object including:
- Version components (major, minor, patch)
- Build information (ID, timestamp, commit)
- Component versions
- GitHub repository information

#### `KasOSVersionControl.incrementVersion(type, prerelease)`
Increment version number.
- `type` (string): 'major', 'minor', 'patch', or 'prerelease'
- `prerelease` (string): Prerelease identifier (alpha, beta, rc)

#### `KasOSVersionControl.compareVersions(version1, version2)`
Compare two version strings. Returns:
- `1` if version1 > version2
- `0` if version1 = version2
- `-1` if version1 < version2

#### `KasOSVersionControl.updateComponentVersion(componentId, version, status)`
Update version information for a specific component.

### GitHub Integration

#### `KasOSVersionControl.getLatestRelease()`
Get latest release information from GitHub.

#### `KasOSVersionControl.createRelease(tagName, name, body, draft, prerelease)`
Create a new GitHub release.

#### `KasOSVersionControl.checkForUpdates()`
Check if updates are available from GitHub.

### History and Changelog

#### `KasOSVersionControl.generateChangelog(maxEntries)`
Generate markdown changelog from version history.

#### `KasOSVersionControl.addToHistory(action, details)`
Add entry to version history.

## Display Components API

### `KasOSVersionDisplay.createVersionBadge(options)`
Create a clickable version badge.

Options:
- `showCodename` (boolean): Show version codename
- `showEnvironment` (boolean): Show environment (dev/staging/prod)
- `showBuildId` (boolean): Show build ID
- `compact` (boolean): Use compact format
- `className` (string): Custom CSS class

### `KasOSVersionDisplay.createVersionPanel()`
Create detailed version information panel.

### `KasOSVersionDisplay.showVersionModal()`
Show version information in a modal dialog.

### `KasOSVersionDisplay.addToFooter(containerId)`
Add version badge to page footer.

## Configuration

### Environment Variables
The build scripts support environment variables for CI/CD:

- `GITHUB_SHA` - Git commit hash
- `GITHUB_REF_NAME` - Git branch name
- `GITHUB_TOKEN` - GitHub API token
- `CI_ENVIRONMENT` - Build environment

### GitHub Integration Setup
1. Set repository information in `version-control.js`:
   ```javascript
   github: {
       repository: 'deokman420/kasos',
       owner: 'deokman420',
       enabled: true
   }
   ```

2. For private repositories, set GitHub token:
   ```javascript
   // In production environment
   window.KasOSVersionControl.github.token = 'your-github-token';
   ```

## Integration with Applications

### Application Version Registration
Applications can register their version information:

```javascript
// In your application
window.applications.myapp = {
    version: '2.1.0',
    // ... other app properties
};

// Update version in version control
window.KasOSVersionControl.updateComponentVersion('myapp', '2.1.0', 'active');
```

### Version Compatibility Checking
```javascript
// Check if current system version is compatible
const isCompatible = window.KasOSVersionControl.isCompatible('1.2.0');

// Strict version matching
const isExactMatch = window.KasOSVersionControl.isCompatible('1.3.0', true);
```

## Deployment

### GitHub Pages
The system includes GitHub Actions workflow for automatic deployment to GitHub Pages:

1. Enable GitHub Pages in repository settings
2. Set source to "GitHub Actions"
3. Push to main branch to trigger deployment

### Manual Deployment
1. Run build script: `.\build.ps1` or `node build.js`
2. Upload files to web server
3. Ensure proper MIME types for `.js` files

## Development

### Adding Version Display to UI
```javascript
// Add to application about dialog
const aboutDialog = document.getElementById('about-dialog');
window.KasOSVersionDisplay.addToAboutDialog(aboutDialog);

// Add to status bar
const statusBar = document.getElementById('status-bar');
const badge = window.KasOSVersionDisplay.createVersionBadge({ compact: true });
statusBar.appendChild(badge);
```

### Custom Version Display
```javascript
// Create custom version display
const customDisplay = document.createElement('div');
const versionInfo = window.KasOSVersionControl.getVersionInfo();
customDisplay.innerHTML = `
    <h3>KasOS ${versionInfo.version}</h3>
    <p>Build: ${versionInfo.build.id}</p>
    <p>Environment: ${versionInfo.build.environment}</p>
`;
```

## Troubleshooting

### Common Issues

1. **"Version control not initialized"**
   - Ensure `version-control.js` is loaded before other scripts
   - Check browser console for errors

2. **"GitHub integration not available"**
   - Check internet connection
   - Verify repository settings
   - Ensure API token is valid (if required)

3. **"Build script execution failed"**
   - Ensure PowerShell execution policy allows scripts
   - Check Node.js installation (for Node.js script)
   - Verify file permissions

### Debug Information
```javascript
// Get diagnostic information
const diagnostics = window.KasOSVersionControl.getDiagnosticInfo();
console.log(diagnostics);

// Check version control status
console.log('Version Control Status:', {
    initialized: !!window.KasOSVersionControl,
    version: window.KasOSVersionControl?.getVersionString(),
    environment: window.KasOSVersionControl?.build?.environment
});
```

## License

This version control system is part of KasOS and is licensed under the MIT License. See the main KasOS LICENSE file for details.
