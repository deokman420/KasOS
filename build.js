#!/usr/bin/env node

/**
 * KasOS Build Script
 * Automatically updates version information and prepares for deployment
 * 
 * Usage:
 *   node build.js [major|minor|patch|prerelease] [options]
 * 
 * Options:
 *   --dry-run       Show what would be done without making changes
 *   --env ENV       Set environment (development, staging, production)
 *   --commit HASH   Set specific commit hash
 *   --branch NAME   Set specific branch name
 *   --no-git       Skip git operations
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class KasOSBuilder {
    constructor() {
        this.config = {
            dryRun: false,
            environment: 'production',
            commitHash: null,
            branch: null,
            skipGit: false,
            versionType: 'patch'
        };
        
        this.projectRoot = process.cwd();
        this.versionFile = path.join(this.projectRoot, 'version-control.js');
    }

    parseArgs() {
        const args = process.argv.slice(2);
        
        // Parse version type
        const versionTypes = ['major', 'minor', 'patch', 'prerelease'];
        const versionType = args.find(arg => versionTypes.includes(arg));
        if (versionType) {
            this.config.versionType = versionType;
        }

        // Parse options
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            
            switch (arg) {
                case '--dry-run':
                    this.config.dryRun = true;
                    break;
                    
                case '--env':
                    this.config.environment = args[i + 1];
                    i++; // Skip next arg
                    break;
                    
                case '--commit':
                    this.config.commitHash = args[i + 1];
                    i++; // Skip next arg
                    break;
                    
                case '--branch':
                    this.config.branch = args[i + 1];
                    i++; // Skip next arg
                    break;
                    
                case '--no-git':
                    this.config.skipGit = true;
                    break;
            }
        }
    }

    log(message, level = 'info') {
        const prefix = {
            info: '🔧',
            success: '✅',
            warn: '⚠️',
            error: '❌'
        }[level] || '📋';
        
        console.log(`${prefix} ${message}`);
    }

    execCommand(command, options = {}) {
        try {
            if (this.config.dryRun) {
                this.log(`Would execute: ${command}`, 'info');
                return '';
            }
            
            const result = execSync(command, { 
                encoding: 'utf8', 
                cwd: this.projectRoot,
                ...options 
            });
            return result.trim();
        } catch (error) {
            if (options.ignoreErrors) {
                return '';
            }
            throw error;
        }
    }

    getGitInfo() {
        if (this.config.skipGit) {
            return {
                commitHash: this.config.commitHash || 'unknown',
                branch: this.config.branch || 'unknown',
                isClean: true
            };
        }

        try {
            const commitHash = this.config.commitHash || this.execCommand('git rev-parse HEAD', { ignoreErrors: true }).substring(0, 8);
            const branch = this.config.branch || this.execCommand('git rev-parse --abbrev-ref HEAD', { ignoreErrors: true });
            const status = this.execCommand('git status --porcelain', { ignoreErrors: true });
            
            return {
                commitHash: commitHash || 'unknown',
                branch: branch || 'main',
                isClean: status.length === 0
            };
        } catch (error) {
            this.log('Git not available, using defaults', 'warn');
            return {
                commitHash: 'unknown',
                branch: 'main',
                isClean: true
            };
        }
    }

    updateVersionFile() {
        if (!fs.existsSync(this.versionFile)) {
            this.log('Version control file not found', 'error');
            return false;
        }

        const gitInfo = this.getGitInfo();
        
        // Read current version file
        let content = fs.readFileSync(this.versionFile, 'utf8');
        
        // Update build information
        const buildInfo = `
        build: {
            number: ${Date.now()},
            timestamp: "${new Date().toISOString()}",
            commitHash: "${gitInfo.commitHash}",
            branch: "${gitInfo.branch}",
            environment: "${this.config.environment}",
            buildId: null
        },`;

        // Replace build section
        content = content.replace(
            /build:\s*{[^}]*},/s,
            buildInfo.trim() + ','
        );

        if (this.config.dryRun) {
            this.log('Would update version file with new build info', 'info');
            return true;
        }

        fs.writeFileSync(this.versionFile, content);
        this.log('Updated version file with build information', 'success');
        return true;
    }

    generatePackageJson() {
        const packagePath = path.join(this.projectRoot, 'package.json');
        
        // Check if package.json exists
        let packageData = {};
        if (fs.existsSync(packagePath)) {
            packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        }

        // Load version from version control
        const versionControlPath = this.versionFile;
        if (fs.existsSync(versionControlPath)) {
            // This is a simplified approach - in a real build, you'd properly parse the JS
            const content = fs.readFileSync(versionControlPath, 'utf8');
            const majorMatch = content.match(/major:\s*(\d+)/);
            const minorMatch = content.match(/minor:\s*(\d+)/);
            const patchMatch = content.match(/patch:\s*(\d+)/);
            
            if (majorMatch && minorMatch && patchMatch) {
                const version = `${majorMatch[1]}.${minorMatch[1]}.${patchMatch[1]}`;
                packageData.version = version;
            }
        }

        // Update package.json with KasOS information
        packageData.name = packageData.name || 'kasos';
        packageData.description = packageData.description || 'KasOS - Web-based Desktop Environment with Kaspa Integration';
        packageData.keywords = packageData.keywords || ['desktop', 'os', 'kaspa', 'blockchain', 'webapp'];
        packageData.author = packageData.author || 'KasOS Team';
        packageData.license = packageData.license || 'MIT';
        packageData.homepage = packageData.homepage || 'https://github.com/KasOS/webos';
        
        packageData.scripts = packageData.scripts || {};
        packageData.scripts.build = packageData.scripts.build || 'node build.js';
        packageData.scripts.dev = packageData.scripts.dev || 'python -m http.server 8080';
        packageData.scripts.version = packageData.scripts.version || 'node build.js';

        if (this.config.dryRun) {
            this.log('Would create/update package.json', 'info');
            return;
        }

        fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2));
        this.log('Generated/updated package.json', 'success');
    }

    createGitHubWorkflow() {
        const workflowDir = path.join(this.projectRoot, '.github', 'workflows');
        const workflowFile = path.join(workflowDir, 'build.yml');

        const workflow = `name: KasOS Build and Deploy

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  release:
    types: [ published ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install --production
      
    - name: Update version information
      run: node build.js --env production --commit \${{ github.sha }} --branch \${{ github.ref_name }}
      
    - name: Run tests
      run: |
        # Add your test commands here
        echo "Running tests..."
        
    - name: Build for production
      run: |
        echo "Building KasOS for production..."
        # Add build commands here
        
    - name: Deploy to GitHub Pages (on main branch)
      if: github.ref == 'refs/heads/main'
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: \${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
        exclude_assets: '.github,node_modules,*.md,build.js'
        
    - name: Create Release Asset
      if: github.event_name == 'release'
      run: |
        zip -r kasos-\${{ github.ref_name }}.zip . -x "*.git*" "node_modules/*" "*.md" "build.js"
        
    - name: Upload Release Asset
      if: github.event_name == 'release'
      uses: actions/upload-release-asset@v1
      env:
        GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
      with:
        upload_url: \${{ github.event.release.upload_url }}
        asset_path: ./kasos-\${{ github.ref_name }}.zip
        asset_name: kasos-\${{ github.ref_name }}.zip
        asset_content_type: application/zip
`;

        if (this.config.dryRun) {
            this.log('Would create GitHub workflow file', 'info');
            return;
        }

        // Create .github/workflows directory if it doesn't exist
        if (!fs.existsSync(workflowDir)) {
            fs.mkdirSync(workflowDir, { recursive: true });
        }

        fs.writeFileSync(workflowFile, workflow);
        this.log('Created GitHub workflow file', 'success');
    }

    validateFiles() {
        const requiredFiles = [
            'index.html',
            'version-control.js',
            'version-display.js',
            'README.md'
        ];

        const missing = requiredFiles.filter(file => 
            !fs.existsSync(path.join(this.projectRoot, file))
        );

        if (missing.length > 0) {
            this.log(`Missing required files: ${missing.join(', ')}`, 'error');
            return false;
        }

        this.log('All required files present', 'success');
        return true;
    }

    displaySummary() {
        const gitInfo = this.getGitInfo();
        
        console.log('\n📋 Build Summary');
        console.log('================');
        console.log(`Version Type: ${this.config.versionType}`);
        console.log(`Environment: ${this.config.environment}`);
        console.log(`Commit: ${gitInfo.commitHash}`);
        console.log(`Branch: ${gitInfo.branch}`);
        console.log(`Clean: ${gitInfo.isClean ? 'Yes' : 'No'}`);
        console.log(`Dry Run: ${this.config.dryRun ? 'Yes' : 'No'}`);
        
        if (!gitInfo.isClean && !this.config.dryRun) {
            this.log('Working directory is not clean - uncommitted changes detected', 'warn');
        }
    }

    async build() {
        this.log('Starting KasOS build process', 'info');
        
        try {
            // Validate environment
            if (!this.validateFiles()) {
                throw new Error('Validation failed');
            }

            // Update version information
            this.updateVersionFile();

            // Generate package.json
            this.generatePackageJson();

            // Create GitHub workflow (if not exists)
            const workflowPath = path.join(this.projectRoot, '.github', 'workflows', 'build.yml');
            if (!fs.existsSync(workflowPath)) {
                this.createGitHubWorkflow();
            }

            // Display summary
            this.displaySummary();

            this.log('Build process completed successfully', 'success');
            
        } catch (error) {
            this.log(`Build failed: ${error.message}`, 'error');
            process.exit(1);
        }
    }
}

// Main execution
if (require.main === module) {
    const builder = new KasOSBuilder();
    builder.parseArgs();
    builder.build();
}

module.exports = KasOSBuilder;
