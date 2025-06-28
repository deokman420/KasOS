/**
 * KasOS Version Control System
 * Robust versioning system that integrates with GitHub and provides comprehensive version tracking
 * 
 * Features:
 * - Semantic versioning (MAJOR.MINOR.PATCH)
 * - Build tracking with timestamps and commit hashes
 * - GitHub integration for release management
 * - Component-level versioning for applications
 * - Version comparison and compatibility checking
 * - Auto-increment capabilities
 * - Development/staging/production environments
 */

window.KasOSVersionControl = {
    // Core version information
    version: {
        major: 2,
        minor: 5,
        patch: 0,
        prerelease: null, // alpha, beta, rc
        build: null,
        codename: "Kaspa Integration"
    },

    // Build and environment information
    build: {
        number: null,
        timestamp: null,
        commitHash: null,
        branch: 'main',
        environment: 'development', // development, staging, production
        buildId: null
    },

    // GitHub integration settings
    github: {
        repository: 'KasOS/webos',
        owner: 'KasOS',
        apiBase: 'https://api.github.com',
        enabled: true,
        token: null // Set via environment or configuration
    },

    // Component versioning (applications and modules)
    components: {},

    // Version history and changelog
    history: [],

    // Initialize the version control system
    init: function() {
        console.log('🔄 Initializing KasOS Version Control System');
        
        try {
            this.loadVersionData();
            this.detectEnvironment();
            this.generateBuildId();
            this.registerComponents();
            this.initializeGitHubIntegration();
            
            console.log(`✅ KasOS Version Control initialized: ${this.getVersionString()}`);
            
            // Log version information
            this.logVersionInfo();
            
        } catch (error) {
            console.error('❌ Failed to initialize version control:', error);
        }
    },

    // Load version data from storage or defaults
    loadVersionData: function() {
        try {
            const storedVersion = localStorage.getItem('kasos_version_data');
            if (storedVersion) {
                const versionData = JSON.parse(storedVersion);
                
                // Merge with current version, preferring stored data for builds
                if (versionData.build) {
                    this.build = { ...this.build, ...versionData.build };
                }
                
                if (versionData.history) {
                    this.history = versionData.history;
                }
                
                if (versionData.components) {
                    this.components = versionData.components;
                }
            }
        } catch (error) {
            console.warn('⚠️ Could not load stored version data:', error);
        }
    },

    // Save version data to storage
    saveVersionData: function() {
        try {
            const versionData = {
                version: this.version,
                build: this.build,
                history: this.history.slice(-50), // Keep last 50 entries
                components: this.components,
                lastUpdated: new Date().toISOString()
            };
            
            localStorage.setItem('kasos_version_data', JSON.stringify(versionData));
            
        } catch (error) {
            console.error('❌ Failed to save version data:', error);
        }
    },

    // Detect current environment
    detectEnvironment: function() {
        const hostname = window.location.hostname;
        const port = window.location.port;
        
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            this.build.environment = 'development';
        } else if (hostname.includes('staging') || hostname.includes('test')) {
            this.build.environment = 'staging';
        } else {
            this.build.environment = 'production';
        }

        // Check for development indicators
        if (port && (port === '3000' || port === '5173' || port === '8080')) {
            this.build.environment = 'development';
        }

        console.log(`🌍 Environment detected: ${this.build.environment}`);
    },

    // Generate unique build ID
    generateBuildId: function() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        this.build.buildId = `${timestamp}-${random}`;
        this.build.timestamp = new Date().toISOString();
        
        console.log(`🔨 Build ID generated: ${this.build.buildId}`);
    },

    // Register application and component versions
    registerComponents: function() {
        const apps = [
            'kasia-direct',
            'kaspa-explorer', 
            'krc20-dex',
            'fileexplorer',
            'terminal',
            'calculator',
            'notes',
            'settings',
            'whitepaper-app',
            'ai-assistant'
        ];

        apps.forEach(appId => {
            try {
                // Try to get version from the application object
                const app = window[appId] || this.findApplicationById(appId);
                if (app && app.version) {
                    this.components[appId] = {
                        version: app.version,
                        lastUpdated: new Date().toISOString(),
                        status: 'active'
                    };
                } else {
                    // Default version for unversioned components
                    this.components[appId] = {
                        version: '1.0.0',
                        lastUpdated: new Date().toISOString(),
                        status: 'unknown'
                    };
                }
            } catch (error) {
                console.warn(`⚠️ Could not register component ${appId}:`, error);
            }
        });

        console.log(`📦 Registered ${Object.keys(this.components).length} components`);
    },

    // Find application by ID in the applications registry
    findApplicationById: function(appId) {
        if (window.applications && window.applications[appId]) {
            return window.applications[appId];
        }
        
        // Try global scope
        const possibleNames = [appId, `${appId}App`, `${appId.replace('-', '')}App`];
        for (const name of possibleNames) {
            if (window[name]) {
                return window[name];
            }
        }
        
        return null;
    },

    // Initialize GitHub integration
    initializeGitHubIntegration: function() {
        if (!this.github.enabled) {
            return;
        }

        try {
            // Try to detect git information from environment
            this.detectGitInfo();
            
            // Set up GitHub API headers
            this.setupGitHubAPI();
            
            console.log('🐙 GitHub integration initialized');
            
        } catch (error) {
            console.warn('⚠️ GitHub integration not available:', error);
            this.github.enabled = false;
        }
    },

    // Detect git information (commit hash, branch)
    detectGitInfo: function() {
        // In a real deployment, this would be injected during build
        // For now, we'll use placeholder values
        
        if (!this.build.commitHash) {
            // Try to get from build environment variables or CI
            this.build.commitHash = this.getCommitHashFromBuild();
        }
        
        if (!this.build.branch) {
            this.build.branch = this.getBranchFromBuild() || 'main';
        }
    },

    // Get commit hash from build environment (placeholder)
    getCommitHashFromBuild: function() {
        // In a real CI/CD pipeline, this would be injected
        // Example: process.env.GITHUB_SHA or process.env.CI_COMMIT_SHA
        
        // For development, generate a mock hash
        if (this.build.environment === 'development') {
            return 'dev-' + Math.random().toString(16).substring(2, 10);
        }
        
        return null;
    },

    // Get branch from build environment (placeholder)
    getBranchFromBuild: function() {
        // In a real CI/CD pipeline, this would be injected
        // Example: process.env.GITHUB_REF_NAME or process.env.CI_COMMIT_REF_NAME
        return null;
    },

    // Set up GitHub API configuration
    setupGitHubAPI: function() {
        // GitHub API token would be set from environment variables
        // this.github.token = process.env.GITHUB_TOKEN;
        
        // For client-side usage, we'd use public API endpoints only
        this.github.apiHeaders = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': `KasOS/${this.getVersionString()}`
        };
        
        if (this.github.token) {
            this.github.apiHeaders['Authorization'] = `token ${this.github.token}`;
        }
    },

    // Get formatted version string
    getVersionString: function(includePrerelease = true, includeBuild = false) {
        let version = `${this.version.major}.${this.version.minor}.${this.version.patch}`;
        
        if (includePrerelease && this.version.prerelease) {
            version += `-${this.version.prerelease}`;
        }
        
        if (includeBuild && this.build.number) {
            version += `+${this.build.number}`;
        }
        
        return version;
    },

    // Get full version information
    getVersionInfo: function() {
        return {
            version: this.getVersionString(true, true),
            major: this.version.major,
            minor: this.version.minor,
            patch: this.version.patch,
            prerelease: this.version.prerelease,
            codename: this.version.codename,
            build: {
                id: this.build.buildId,
                number: this.build.number,
                timestamp: this.build.timestamp,
                commitHash: this.build.commitHash,
                branch: this.build.branch,
                environment: this.build.environment
            },
            components: this.components,
            github: {
                repository: `${this.github.owner}/${this.github.repository}`,
                enabled: this.github.enabled
            }
        };
    },

    // Increment version numbers
    incrementVersion: function(type = 'patch', prerelease = null) {
        const oldVersion = this.getVersionString();
        
        switch (type) {
            case 'major':
                this.version.major++;
                this.version.minor = 0;
                this.version.patch = 0;
                this.version.prerelease = null;
                break;
                
            case 'minor':
                this.version.minor++;
                this.version.patch = 0;
                this.version.prerelease = null;
                break;
                
            case 'patch':
                this.version.patch++;
                this.version.prerelease = null;
                break;
                
            case 'prerelease':
                this.version.prerelease = prerelease || 'alpha';
                break;
        }
        
        // Generate new build info
        this.generateBuildId();
        
        // Add to history
        this.addToHistory('version_increment', {
            from: oldVersion,
            to: this.getVersionString(),
            type: type
        });
        
        // Save changes
        this.saveVersionData();
        
        console.log(`📈 Version incremented: ${oldVersion} → ${this.getVersionString()}`);
        
        return this.getVersionString();
    },

    // Add entry to version history
    addToHistory: function(action, details = {}) {
        const entry = {
            timestamp: new Date().toISOString(),
            action: action,
            version: this.getVersionString(),
            buildId: this.build.buildId,
            environment: this.build.environment,
            details: details
        };
        
        this.history.unshift(entry);
        
        // Keep only last 100 entries
        if (this.history.length > 100) {
            this.history = this.history.slice(0, 100);
        }
    },

    // Compare versions
    compareVersions: function(version1, version2) {
        const v1Parts = this.parseVersion(version1);
        const v2Parts = this.parseVersion(version2);
        
        // Compare major.minor.patch
        for (let i = 0; i < 3; i++) {
            if (v1Parts[i] > v2Parts[i]) return 1;
            if (v1Parts[i] < v2Parts[i]) return -1;
        }
        
        return 0; // Equal
    },

    // Parse version string into components
    parseVersion: function(versionString) {
        const parts = versionString.split(/[-+]/)[0].split('.');
        return [
            parseInt(parts[0]) || 0,
            parseInt(parts[1]) || 0,
            parseInt(parts[2]) || 0
        ];
    },

    // Check if current version is compatible with required version
    isCompatible: function(requiredVersion, strict = false) {
        const comparison = this.compareVersions(this.getVersionString(), requiredVersion);
        
        if (strict) {
            return comparison === 0; // Exact match required
        } else {
            return comparison >= 0; // Current version must be >= required
        }
    },

    // Update component version
    updateComponentVersion: function(componentId, version, status = 'active') {
        this.components[componentId] = {
            version: version,
            lastUpdated: new Date().toISOString(),
            status: status
        };
        
        this.addToHistory('component_update', {
            component: componentId,
            version: version,
            status: status
        });
        
        this.saveVersionData();
        
        console.log(`📦 Component ${componentId} updated to version ${version}`);
    },

    // GitHub API: Get latest release
    getLatestRelease: async function() {
        if (!this.github.enabled) {
            throw new Error('GitHub integration not enabled');
        }
        
        try {
            const response = await fetch(
                `${this.github.apiBase}/repos/${this.github.owner}/${this.github.repository}/releases/latest`,
                { headers: this.github.apiHeaders }
            );
            
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            
            return await response.json();
            
        } catch (error) {
            console.error('❌ Failed to get latest release:', error);
            throw error;
        }
    },

    // GitHub API: Create release
    createRelease: async function(tagName, name, body, draft = false, prerelease = false) {
        if (!this.github.enabled || !this.github.token) {
            throw new Error('GitHub integration not properly configured');
        }
        
        try {
            const releaseData = {
                tag_name: tagName,
                name: name,
                body: body,
                draft: draft,
                prerelease: prerelease,
                target_commitish: this.build.branch
            };
            
            const response = await fetch(
                `${this.github.apiBase}/repos/${this.github.owner}/${this.github.repository}/releases`,
                {
                    method: 'POST',
                    headers: {
                        ...this.github.apiHeaders,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(releaseData)
                }
            );
            
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            
            const release = await response.json();
            
            this.addToHistory('github_release', {
                tag: tagName,
                name: name,
                url: release.html_url,
                draft: draft,
                prerelease: prerelease
            });
            
            console.log(`🚀 GitHub release created: ${release.html_url}`);
            
            return release;
            
        } catch (error) {
            console.error('❌ Failed to create GitHub release:', error);
            throw error;
        }
    },

    // Check for updates from GitHub
    checkForUpdates: async function() {
        if (!this.github.enabled) {
            return null;
        }
        
        try {
            const latestRelease = await this.getLatestRelease();
            const latestVersion = latestRelease.tag_name.replace(/^v/, ''); // Remove 'v' prefix
            const currentVersion = this.getVersionString();
            
            const comparison = this.compareVersions(latestVersion, currentVersion);
            
            if (comparison > 0) {
                return {
                    available: true,
                    latest: latestVersion,
                    current: currentVersion,
                    release: latestRelease
                };
            }
            
            return {
                available: false,
                latest: latestVersion,
                current: currentVersion
            };
            
        } catch (error) {
            console.error('❌ Failed to check for updates:', error);
            return null;
        }
    },

    // Generate changelog from history
    generateChangelog: function(maxEntries = 20) {
        const entries = this.history.slice(0, maxEntries);
        let changelog = `# KasOS Changelog\n\n`;
        
        let currentVersion = null;
        
        entries.forEach(entry => {
            if (entry.version !== currentVersion) {
                currentVersion = entry.version;
                changelog += `## [${currentVersion}] - ${entry.timestamp.split('T')[0]}\n\n`;
            }
            
            switch (entry.action) {
                case 'version_increment':
                    changelog += `### Changed\n- Version updated from ${entry.details.from} to ${entry.details.to}\n\n`;
                    break;
                    
                case 'component_update':
                    changelog += `### Updated\n- ${entry.details.component} updated to version ${entry.details.version}\n\n`;
                    break;
                    
                case 'github_release':
                    changelog += `### Released\n- [GitHub Release: ${entry.details.name}](${entry.details.url})\n\n`;
                    break;
            }
        });
        
        return changelog;
    },

    // Export version information for CI/CD
    exportVersionInfo: function() {
        const versionInfo = this.getVersionInfo();
        
        // Format for different CI/CD systems
        return {
            // For package.json
            npm: {
                version: this.getVersionString()
            },
            
            // For Docker
            docker: {
                tag: this.getVersionString(),
                latest: this.build.environment === 'production'
            },
            
            // For GitHub Actions
            github: {
                version: this.getVersionString(),
                tag: `v${this.getVersionString()}`,
                environment: this.build.environment,
                commit: this.build.commitHash,
                branch: this.build.branch
            },
            
            // Full information
            full: versionInfo
        };
    },

    // Log version information to console
    logVersionInfo: function() {
        console.group('📋 KasOS Version Information');
        console.log(`Version: ${this.getVersionString(true, true)}`);
        console.log(`Codename: ${this.version.codename}`);
        console.log(`Environment: ${this.build.environment}`);
        console.log(`Build ID: ${this.build.buildId}`);
        console.log(`Build Time: ${this.build.timestamp}`);
        
        if (this.build.commitHash) {
            console.log(`Commit: ${this.build.commitHash}`);
        }
        
        if (this.build.branch) {
            console.log(`Branch: ${this.build.branch}`);
        }
        
        console.log(`Components: ${Object.keys(this.components).length} registered`);
        console.log(`GitHub Integration: ${this.github.enabled ? 'Enabled' : 'Disabled'}`);
        console.groupEnd();
    },

    // Diagnostic information for debugging
    getDiagnosticInfo: function() {
        return {
            version: this.getVersionInfo(),
            storage: {
                available: typeof(Storage) !== 'undefined',
                quota: this.getStorageQuota()
            },
            github: {
                enabled: this.github.enabled,
                configured: !!this.github.token,
                repository: `${this.github.owner}/${this.github.repository}`
            },
            history: {
                entries: this.history.length,
                lastEntry: this.history[0]
            },
            components: Object.keys(this.components).length
        };
    },

    // Get storage quota information
    getStorageQuota: function() {
        try {
            if (navigator.storage && navigator.storage.estimate) {
                return navigator.storage.estimate();
            }
        } catch (error) {
            console.warn('Storage quota estimation not available');
        }
        return null;
    }
};

// Initialize version control system when script loads
if (typeof window !== 'undefined') {
    // Auto-initialize with a small delay to ensure dependencies are loaded
    setTimeout(() => {
        window.KasOSVersionControl.init();
    }, 100);
}

// Export for Node.js environments (build scripts)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.KasOSVersionControl;
}
