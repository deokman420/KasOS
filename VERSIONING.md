# KasOS Versioning System

A comprehensive version management system for KasOS that integrates with GitHub for automated releases and version tracking.

## 🚀 Features

- **Semantic Versioning**: Full SemVer support (MAJOR.MINOR.PATCH)
- **GitHub Integration**: Automated releases with changelogs
- **Build Tracking**: Unique build IDs and timestamps
- **Component Versioning**: Track individual application versions
- **Environment Detection**: Development, staging, production
- **Git Integration**: Automatic commit hash and branch tracking
- **Changelog Generation**: Automated changelog from Git history
- **CI/CD Ready**: GitHub Actions workflows included

## 📁 Structure

```
scripts/
├── version-check.js      # Validate version consistency
├── version-bump.js       # Increment versions
├── github-release.js     # Create GitHub releases
└── generate-changelog.js # Generate changelogs

.github/workflows/
├── version-check.yml     # CI version validation
└── release.yml          # Automated releases

version-control.js        # Core version management
version-display.js        # UI version components
package.json             # NPM version anchor
```

## 🛠️ Quick Start

### 1. Check Current Version

```bash
npm run version
```

This validates version consistency across all files and shows current status.

### 2. Bump Version

```bash
# Patch release (2.5.0 → 2.5.1)
npm run version:patch

# Minor release (2.5.0 → 2.6.0)
npm run version:minor

# Major release (2.5.0 → 3.0.0)
npm run version:major

# Prerelease (2.5.0 → 2.5.1-alpha)
npm run version:prerelease
```

### 3. Create GitHub Release

```bash
# Create release (requires GITHUB_TOKEN)
npm run release

# Create draft release
npm run release:draft

# Manual with Node.js
node scripts/github-release.js --draft
```

### 4. Generate Changelog

```bash
npm run changelog
```

## ⚙️ Configuration

### GitHub Token Setup

For automated releases, set your GitHub token:

```bash
# Windows (PowerShell)
$env:GITHUB_TOKEN="ghp_your_token_here"

# Linux/macOS
export GITHUB_TOKEN="ghp_your_token_here"
```

### Repository Settings

Update the GitHub repository information in:

1. `package.json` - Update repository URL
2. `scripts/github-release.js` - Update owner/repo
3. `scripts/generate-changelog.js` - Update commit URLs

## 📋 Version Management

### Semantic Versioning

The system follows [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)
- **PRERELEASE**: Alpha, beta, rc versions

### Version Consistency

The system maintains version consistency across:

- `package.json` (npm standard)
- `version-control.js` (runtime version)
- Git tags (repository tags)
- GitHub releases (release metadata)

### Component Versioning

Individual applications can have their own versions:

```javascript
// Register component version
window.KasOSVersionControl.updateComponentVersion('kasia-direct', '1.2.0');

// Check component compatibility
const isCompatible = window.KasOSVersionControl.isCompatible('1.0.0');
```

## 🤖 Automation

### GitHub Actions

Two workflows are included:

#### Version Check (`version-check.yml`)
- Runs on push/PR to main branch
- Validates version consistency
- Checks semantic version format
- Performs security audit
- Tests application startup

#### Release (`release.yml`)
- Triggers on version tags (`v*`)
- Creates GitHub releases
- Generates changelogs
- Uploads release assets
- Supports manual dispatch

### Manual Release Process

1. **Bump Version**:
   ```bash
   npm run version:patch
   ```

2. **Commit Changes**:
   ```bash
   git add .
   git commit -m "chore: bump version to 2.5.1"
   ```

3. **Push with Tags**:
   ```bash
   git push origin main --tags
   ```

4. **Create Release**:
   ```bash
   npm run release
   ```

## 📊 Version Information

### Runtime Access

```javascript
// Get current version
const version = window.KasOSVersionControl.getVersionString();

// Get full version info
const info = window.KasOSVersionControl.getVersionInfo();

// Check for updates (requires GitHub integration)
const updates = await window.KasOSVersionControl.checkForUpdates();
```

### Display Components

```javascript
// Create version badge
const badge = window.KasOSVersionDisplay.createVersionBadge({
    showCodename: true,
    showEnvironment: true,
    compact: false
});

// Show version modal
window.KasOSVersionDisplay.showVersionModal();
```

## 🔧 Development

### Environment Detection

The system automatically detects environments:

- **Development**: localhost, development ports (3000, 8080, 5173)
- **Staging**: staging/test subdomains
- **Production**: All other deployments

### Build Information

Each version includes:

- **Build ID**: Unique identifier (`timestamp-random`)
- **Timestamp**: ISO 8601 build time
- **Commit Hash**: Git commit (if available)
- **Branch**: Git branch (if available)
- **Environment**: Detected environment

### Debug Information

```javascript
// Get diagnostic info
const diagnostics = window.KasOSVersionControl.getDiagnosticInfo();
console.log(diagnostics);

// View version history
const history = window.KasOSVersionControl.history;
console.log(history);
```

## 📝 Changelog Format

Changelogs follow [Keep a Changelog](https://keepachangelog.com/) format:

```markdown
# Changelog

## [2.5.1] - 2024-01-15

### 🐛 Bug Fixes
- Fixed wallet connection issue
- Resolved display glitch in dark mode

### ✨ Features
- Added new security validation
- Improved error handling

### 📖 Documentation
- Updated API documentation
- Added troubleshooting guide
```

## 🔒 Security

- Version information is read-only at runtime
- GitHub tokens are handled securely via environment variables
- No sensitive information is stored in version data
- All API calls use authenticated GitHub API

## 🚨 Troubleshooting

### Version Mismatch Error

```bash
❌ Version mismatch: package.json (2.5.0) != version-control.js (2.4.0)
```

**Solution**: Run `npm run version:patch` to sync versions.

### GitHub API Errors

```bash
❌ GitHub API error (401): Bad credentials
```

**Solution**: Check your `GITHUB_TOKEN` environment variable.

### Git Repository Issues

```bash
⚠️ Not in a Git repository or Git not available
```

**Solution**: Initialize Git repository or install Git.

## 📚 API Reference

### Core Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `init()` | Initialize version system | `void` |
| `getVersionString()` | Get formatted version | `string` |
| `getVersionInfo()` | Get complete version data | `object` |
| `incrementVersion(type)` | Bump version | `string` |
| `checkForUpdates()` | Check GitHub for updates | `Promise<object>` |
| `createRelease()` | Create GitHub release | `Promise<object>` |

### Utility Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `compareVersions(v1, v2)` | Compare version strings | `number` |
| `isCompatible(required)` | Check compatibility | `boolean` |
| `generateChangelog()` | Generate changelog | `string` |
| `exportVersionInfo()` | Export for CI/CD | `object` |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Run `npm run version` to validate
4. Submit a pull request

Version bumps and releases are automated through CI/CD.

## 📄 License

This versioning system is part of KasOS and follows the same MIT license.
