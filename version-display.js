/**
 * KasOS Version Display Component
 * UI component for displaying version information throughout the system
 */

window.KasOSVersionDisplay = {
    // Create version badge element
    createVersionBadge: function(options = {}) {
        const {
            showCodename = false,
            showEnvironment = false,
            showBuildId = false,
            compact = false,
            className = 'kasos-version-badge'
        } = options;

        const versionInfo = window.KasOSVersionControl.getVersionInfo();
        const badge = document.createElement('div');
        badge.className = className;

        let content = `v${versionInfo.version}`;
        
        if (showCodename && versionInfo.codename) {
            content += ` "${versionInfo.codename}"`;
        }
        
        if (showEnvironment && versionInfo.build.environment !== 'production') {
            content += ` (${versionInfo.build.environment})`;
        }
        
        if (showBuildId && versionInfo.build.id) {
            content += compact ? ` #${versionInfo.build.id.slice(-6)}` : ` Build: ${versionInfo.build.id}`;
        }

        badge.textContent = content;
        badge.title = `KasOS ${versionInfo.version} - Click for details`;
        badge.style.cursor = 'pointer';
        
        // Add click handler to show detailed version info
        badge.addEventListener('click', () => {
            this.showVersionModal();
        });

        return badge;
    },

    // Create detailed version info panel
    createVersionPanel: function() {
        const versionInfo = window.KasOSVersionControl.getVersionInfo();
        const panel = document.createElement('div');
        panel.className = 'kasos-version-panel';
        
        panel.innerHTML = `
            <div class="version-header">
                <h3>KasOS Version Information</h3>
                <button class="close-btn" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="version-content">
                <div class="version-section">
                    <h4>Version</h4>
                    <p><strong>Version:</strong> ${versionInfo.version}</p>
                    <p><strong>Codename:</strong> ${versionInfo.codename}</p>
                    <p><strong>Environment:</strong> ${versionInfo.build.environment}</p>
                </div>
                
                <div class="version-section">
                    <h4>Build Information</h4>
                    <p><strong>Build ID:</strong> ${versionInfo.build.id || 'Not available'}</p>
                    <p><strong>Build Time:</strong> ${versionInfo.build.timestamp ? new Date(versionInfo.build.timestamp).toLocaleString() : 'Not available'}</p>
                    <p><strong>Commit:</strong> ${versionInfo.build.commitHash || 'Not available'}</p>
                    <p><strong>Branch:</strong> ${versionInfo.build.branch || 'Not available'}</p>
                </div>
                
                <div class="version-section">
                    <h4>Components</h4>
                    <div class="components-list">
                        ${Object.entries(versionInfo.components).map(([name, info]) => 
                            `<div class="component-item">
                                <span class="component-name">${name}</span>
                                <span class="component-version">v${info.version}</span>
                                <span class="component-status status-${info.status}">${info.status}</span>
                            </div>`
                        ).join('')}
                    </div>
                </div>
                
                ${versionInfo.github.enabled ? `
                <div class="version-section">
                    <h4>Repository</h4>
                    <p><strong>Repository:</strong> ${versionInfo.github.repository}</p>
                    <p><strong>GitHub Integration:</strong> Enabled</p>
                </div>
                ` : ''}
            </div>
        `;

        return panel;
    },

    // Show version modal
    showVersionModal: function() {
        // Remove existing modal if present
        const existing = document.querySelector('.kasos-version-modal');
        if (existing) {
            existing.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'kasos-version-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                ${this.createVersionPanel().outerHTML}
            </div>
        `;

        document.body.appendChild(modal);
    },

    // Add version to footer or status bar
    addToFooter: function(containerId = 'footer') {
        const container = document.getElementById(containerId);
        if (container) {
            const badge = this.createVersionBadge({ compact: true, showEnvironment: true });
            badge.style.marginLeft = 'auto';
            container.appendChild(badge);
        }
    },

    // Add version to application about dialog
    addToAboutDialog: function(dialogElement) {
        const panel = this.createVersionPanel();
        panel.style.border = 'none';
        panel.style.background = 'transparent';
        dialogElement.appendChild(panel);
    },

    // Initialize version display styles
    initializeStyles: function() {
        const style = document.createElement('style');
        style.textContent = `
            .kasos-version-badge {
                display: inline-block;
                padding: 4px 8px;
                background: rgba(0, 0, 0, 0.1);
                border: 1px solid rgba(0, 0, 0, 0.2);
                border-radius: 4px;
                font-size: 12px;
                font-family: monospace;
                color: #333;
                user-select: none;
                transition: background-color 0.2s;
            }
            
            .kasos-version-badge:hover {
                background: rgba(0, 0, 0, 0.15);
            }
            
            .kasos-version-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .kasos-version-modal .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
            }
            
            .kasos-version-modal .modal-content {
                position: relative;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                max-width: 600px;
                max-height: 80vh;
                overflow: auto;
            }
            
            .kasos-version-panel {
                padding: 20px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            .version-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 10px;
                border-bottom: 1px solid #eee;
            }
            
            .version-header h3 {
                margin: 0;
                color: #333;
            }
            
            .close-btn {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #999;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .close-btn:hover {
                color: #333;
            }
            
            .version-section {
                margin-bottom: 20px;
            }
            
            .version-section h4 {
                margin: 0 0 10px 0;
                color: #555;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .version-section p {
                margin: 5px 0;
                font-size: 14px;
                color: #666;
            }
            
            .version-section strong {
                color: #333;
                font-weight: 600;
            }
            
            .components-list {
                display: grid;
                gap: 8px;
            }
            
            .component-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 8px;
                background: #f8f9fa;
                border-radius: 4px;
                font-size: 13px;
            }
            
            .component-name {
                flex: 1;
                font-weight: 500;
                color: #333;
            }
            
            .component-version {
                font-family: monospace;
                background: #e9ecef;
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 11px;
            }
            
            .component-status {
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 11px;
                font-weight: 500;
                text-transform: uppercase;
            }
            
            .status-active {
                background: #d4edda;
                color: #155724;
            }
            
            .status-unknown {
                background: #fff3cd;
                color: #856404;
            }
            
            .status-error {
                background: #f8d7da;
                color: #721c24;
            }
        `;
        
        document.head.appendChild(style);
    }
};

// Auto-initialize styles when script loads
if (typeof window !== 'undefined') {
    setTimeout(() => {
        window.KasOSVersionDisplay.initializeStyles();
    }, 50);
}
