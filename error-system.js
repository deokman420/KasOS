/**
 * KasOS Error Reporting and Debugging System
 * Provides comprehensive error handling, logging, and debugging capabilities
 */

// Enhanced Error System with Application Debugging
window.errorSystem = {
    errors: [],
    maxErrors: 1000,
    debugMode: true,
    applicationErrors: {},
    launchAttempts: {},
    
    init: function() {
        this.setupGlobalErrorHandlers();
        this.createErrorDisplay();
        this.setupApplicationErrorTracking();
        this.ensureDebugConsole(); // Replace createDebugConsole with ensureDebugConsole
        this.createApplicationLaunchTracker();
        console.log('🔍 Enhanced Error System initialized with debug mode');
    },
    
    setupApplicationErrorTracking: function() {
        // Track application launch attempts
        const originalLaunchApplication = window.KasOS?.prototype?.launchApplication;
        if (originalLaunchApplication) {
            window.KasOS.prototype.launchApplication = function(appName) {
                const startTime = performance.now();
                errorSystem.trackLaunchAttempt(appName, 'started');
                
                try {
                    const result = originalLaunchApplication.call(this, appName);
                    errorSystem.trackLaunchAttempt(appName, 'success', performance.now() - startTime);
                    return result;
                } catch (error) {
                    errorSystem.trackLaunchAttempt(appName, 'error', performance.now() - startTime, error);
                    throw error;
                }
            };
        }
    },
    
    createApplicationLaunchTracker: function() {
        // Override the application loading mechanism to track issues
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const url = args[0];
            if (typeof url === 'string' && url.includes('applications/')) {
                const appName = url.split('/').pop().replace('.js', '');
                errorSystem.log(`📥 Loading application: ${appName}`, 'APP_LOAD', 'info');
                
                return originalFetch.apply(this, args)
                    .then(response => {
                        if (!response.ok) {
                            errorSystem.log(`❌ Failed to load ${appName}: ${response.status} ${response.statusText}`, 'APP_LOAD', 'error');
                        } else {
                            errorSystem.log(`✅ Successfully loaded ${appName}`, 'APP_LOAD', 'success');
                        }
                        return response;
                    })
                    .catch(error => {
                        errorSystem.log(`💥 Network error loading ${appName}: ${error.message}`, 'APP_LOAD', 'error');
                        throw error;
                    });
            }
            return originalFetch.apply(this, args);
        };
    },
    
    trackLaunchAttempt: function(appName, status, duration = 0, error = null) {
        if (!this.launchAttempts[appName]) {
            this.launchAttempts[appName] = [];
        }
        
        const attempt = {
            timestamp: new Date().toISOString(),
            status: status,
            duration: duration,
            error: error ? error.message : null,
            stack: error ? error.stack : null
        };
        
        this.launchAttempts[appName].push(attempt);
        
        if (status === 'error') {
            this.log(`🚫 Application launch failed: ${appName} - ${error?.message}`, 'APP_LAUNCH', 'error');
        } else if (status === 'success') {
            this.log(`🚀 Application launched successfully: ${appName} (${duration.toFixed(2)}ms)`, 'APP_LAUNCH', 'success');
        }
    },
      createDebugConsole: function() {
        // Remove any existing debug console to avoid duplicates
        const oldConsole = document.getElementById('debugConsole');
        if (oldConsole) oldConsole.remove();

        // Create sliding debug console panel from bottom
        const debugConsole = document.createElement('div');
        debugConsole.id = 'debugConsole';
        debugConsole.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 350px;
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            color: #00ff41;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 13px;
            border-top: 3px solid #00ff41;
            box-shadow: 0 -5px 25px rgba(0, 255, 65, 0.2);
            z-index: 10000;
            transform: translateY(100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            flex-direction: column;
        `;
        
        debugConsole.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 20px; background: rgba(0, 255, 65, 0.1); border-bottom: 1px solid rgba(0, 255, 65, 0.3);">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="color: #00ff41; font-weight: bold; font-size: 16px;">🔍 KasOS Debug Console</span>
                    <span style="color: #888; font-size: 11px;">[Ctrl+D to toggle]</span>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button onclick="errorSystem.exportDebugLog()" style="background: rgba(0, 255, 65, 0.2); color: #00ff41; border: 1px solid rgba(0, 255, 65, 0.3); padding: 4px 12px; border-radius: 4px; cursor: pointer; font-size: 11px;">Export</button>
                    <button onclick="errorSystem.clearDebugConsole()" style="background: rgba(255, 69, 0, 0.2); color: #ff4500; border: 1px solid rgba(255, 69, 0, 0.3); padding: 4px 12px; border-radius: 4px; cursor: pointer; font-size: 11px;">Clear</button>
                    <button onclick="errorSystem.toggleDebugConsole()" style="background: rgba(255, 255, 255, 0.1); color: #fff; border: 1px solid rgba(255, 255, 255, 0.2); padding: 4px 12px; border-radius: 4px; cursor: pointer; font-size: 11px;">×</button>
                </div>
            </div>
            <div id="debugOutput" style="flex: 1; padding: 15px 20px; overflow-y: auto; white-space: pre-wrap; word-wrap: break-word; line-height: 1.4; background: rgba(0, 0, 0, 0.3);"></div>
            <div style="padding: 8px 20px; background: rgba(0, 0, 0, 0.5); border-top: 1px solid rgba(0, 255, 65, 0.2); font-size: 11px; color: #888;">
                Debug session active • Real-time system monitoring • Press Ctrl+Shift+E for Error Tracker
            </div>
        `;
        
        document.body.appendChild(debugConsole);
        
        // Add toggle hotkeys (only once)
        if (!window.__KasOSDebugHotkeys) {
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === 'd') {
                    e.preventDefault();
                    window.errorSystem.toggleDebugConsole();
                }
                if (e.ctrlKey && e.shiftKey && e.key === 'E') {
                    e.preventDefault();
                    window.errorSystem.openErrorTracker();
                }
            });
            window.__KasOSDebugHotkeys = true;
        }
    },
    
    // Ensure the debug console exists and is ready
    ensureDebugConsole: function() {
        if (!document.getElementById('debugConsole')) {
            this.createDebugConsole();
        }
    },
    
    toggleDebugConsole: function() {
        this.ensureDebugConsole(); // Ensure console exists before toggling
        const console = document.getElementById('debugConsole');
        if (console) {
            const isVisible = console.style.transform === 'translateY(0px)';
            if (isVisible) {
                console.style.transform = 'translateY(100%)';
            } else {
                console.style.transform = 'translateY(0px)';
            }
        }
    },
    
    showDebugConsole: function() {
        this.ensureDebugConsole(); // Ensure console exists before showing
        const console = document.getElementById('debugConsole');
        if (console) {
            console.style.transform = 'translateY(0px)';
        }
    },
    
    hideDebugConsole: function() {
        this.ensureDebugConsole(); // Ensure console exists before hiding
        const console = document.getElementById('debugConsole');
        if (console) {
            console.style.transform = 'translateY(100%)';
        }
    },
    
    openErrorTracker: function() {
        // Launch the Error Tracker application if KasOS is available
        if (window.KasOS && typeof window.KasOS.launchApplication === 'function') {
            window.KasOS.launchApplication('error-tracker');
        } else {
            console.warn('KasOS not available - cannot launch Error Tracker');
        }
    },
    
    exportDebugLog: function() {
        const output = document.getElementById('debugOutput');
        if (!output) return;
        
        const logData = {
            timestamp: new Date().toISOString(),
            debugLog: output.textContent,
            errors: this.errors.slice(0, 50), // Last 50 errors
            systemInfo: {
                userAgent: navigator.userAgent,
                url: window.location.href,
                debugMode: this.debugMode,
                storage: this.getStorageInfo()
            }
        };
        
        const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `KasOS-debug-log-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    },
    
    clearDebugConsole: function() {
        this.ensureDebugConsole(); // Ensure console exists before clearing
        const output = document.getElementById('debugOutput');
        if (output) {
            output.innerHTML = '';
        }
    },
    
    logToDebugConsole: function(message, category = 'DEBUG', level = 'info') {
        this.ensureDebugConsole(); // Ensure console exists before logging
        const output = document.getElementById('debugOutput');
        if (!output) return;
        
        const timestamp = new Date().toLocaleTimeString();
        const colors = {
            error: '#ff6b6b',
            warning: '#ffd93d',
            success: '#6bcf7f',
            info: '#4dabf7',
            debug: '#ffffff'
        };
        
        const color = colors[level] || colors.debug;
        const logEntry = document.createElement('div');
        logEntry.style.color = color;
        logEntry.style.marginBottom = '2px';
        logEntry.innerHTML = `[${timestamp}] [${category}] ${message}`;
        
        output.appendChild(logEntry);
        output.scrollTop = output.scrollHeight;
        
        // Limit console entries
        if (output.children.length > 100) {
            output.removeChild(output.firstChild);
        }
    },
    
    setupGlobalErrorHandlers: function() {
        // Enhanced error handling with more context
        window.addEventListener('error', (e) => {
            this.log(`💥 JavaScript Error: ${e.message} at ${e.filename}:${e.lineno}:${e.colno}`, 'JS_ERROR', 'error');
            this.logToDebugConsole(`Error: ${e.message}\nFile: ${e.filename}:${e.lineno}:${e.colno}\nStack: ${e.error?.stack}`, 'JS_ERROR', 'error');
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            this.log(`🚫 Unhandled Promise Rejection: ${e.reason}`, 'PROMISE_ERROR', 'error');
            this.logToDebugConsole(`Promise Rejection: ${e.reason}\nStack: ${e.reason?.stack}`, 'PROMISE_ERROR', 'error');
        });
        
        // Override console methods to capture logs
        const originalConsoleError = console.error;
        console.error = (...args) => {
            this.logToDebugConsole(args.join(' '), 'CONSOLE', 'error');
            originalConsoleError.apply(console, args);
        };
        
        const originalConsoleWarn = console.warn;
        console.warn = (...args) => {
            this.logToDebugConsole(args.join(' '), 'CONSOLE', 'warning');
            originalConsoleWarn.apply(console, args);
        };
        
        const originalConsoleLog = console.log;
        console.log = (...args) => {
            if (this.debugMode) {
                this.logToDebugConsole(args.join(' '), 'CONSOLE', 'info');
            }
            originalConsoleLog.apply(console, args);
        };
    },
      // Enhanced logging with better categorization and auto-fix suggestions
    log: function(message, category = 'GENERAL', level = 'info', context = {}) {
        const error = {
            id: Date.now() + Math.random(),
            timestamp: new Date().toISOString(),
            message: message,
            category: category,
            level: level,
            context: context,
            url: window.location.href,
            userAgent: navigator.userAgent,
            stack: new Error().stack,
            fixSuggestions: this.generateFixSuggestions(message, category, level)
        };
        
        this.errors.unshift(error);
        
        if (this.errors.length > this.maxErrors) {
            this.errors = this.errors.slice(0, this.maxErrors);
        }
        
        // Log to debug console
        this.logToDebugConsole(message, category, level);
        
        // Track application-specific errors
        if (category.includes('APP') || category.includes('KASWALLET')) {
            if (!this.applicationErrors[category]) {
                this.applicationErrors[category] = [];
            }
            this.applicationErrors[category].push(error);
        }
          // Auto-show debug console for critical errors
        if (level === 'error' && this.debugMode) {
            const console = document.getElementById('debugConsole');
            if (console) {
                console.style.transform = 'translateY(0px)';
            }
        }
        
        // Auto-analyze for common issues
        this.analyzeErrorForCommonIssues(error);
    },
    
    // Generate automatic fix suggestions based on error patterns
    generateFixSuggestions: function(message, category, level) {
        const suggestions = [];
        const msgLower = message.toLowerCase();
        
        // Common error patterns and their fixes
        if (msgLower.includes('kasware') || msgLower.includes('wallet') || msgLower.includes('metamask')) {
            suggestions.push('Check if wallet extension is installed and enabled');
            suggestions.push('Verify wallet connection status');
            suggestions.push('Try refreshing the page and reconnecting wallet');
        }
        
        if (msgLower.includes('404') || msgLower.includes('not found')) {
            suggestions.push('Check if the application file exists in the applications/ folder');
            suggestions.push('Verify file permissions and accessibility');
            suggestions.push('Clear browser cache and reload');
        }
        
        if (msgLower.includes('syntax') || msgLower.includes('unexpected')) {
            suggestions.push('Check application code for syntax errors');
            suggestions.push('Validate JSON/JavaScript syntax');
            suggestions.push('Review recent code changes');
        }
        
        if (msgLower.includes('network') || msgLower.includes('fetch')) {
            suggestions.push('Check internet connection');
            suggestions.push('Verify server is running');
            suggestions.push('Check for CORS issues');
        }
        
        if (msgLower.includes('permission') || msgLower.includes('denied')) {
            suggestions.push('Check file/folder permissions');
            suggestions.push('Verify user authentication');
            suggestions.push('Clear browser data and try again');
        }
        
        return suggestions;
    },
    
    // Analyze errors for common patterns and provide automated diagnostics
    analyzeErrorForCommonIssues: function(error) {
        const patterns = [
            {
                pattern: /kaswallet|kasware/i,
                diagnostic: () => this.runKasWalletDiagnostic()
            },
            {
                pattern: /404|not found/i,
                diagnostic: () => this.runFileAccessDiagnostic(error.message)
            },
            {
                pattern: /syntax|unexpected/i,
                diagnostic: () => this.runSyntaxDiagnostic(error.message)
            }
        ];
        
        patterns.forEach(({ pattern, diagnostic }) => {
            if (pattern.test(error.message)) {
                setTimeout(diagnostic, 100); // Run diagnostic after error is logged
            }
        });
    },
    
    // Automated KasWallet diagnostic
    runKasWalletDiagnostic: function() {
        const diagnostic = {
            timestamp: new Date().toISOString(),
            kaswareExtension: !!window.kasware,
            kaswareConnect: !!(window.kasware && typeof window.kasware.connect === 'function'),
            appRegistered: !!(window.KasOS && window.KasOS.applications && window.KasOS.applications.kaswallet),
            scriptLoaded: !!document.querySelector('script[src*="kaswallet"]'),
            walletConnected: localStorage.getItem('walletConnected') === 'true',
            walletAddress: localStorage.getItem('walletAddress')
        };
        
        this.logToDebugConsole(`KasWallet Auto-Diagnostic:
Extension: ${diagnostic.kaswareExtension ? '✅' : '❌'}
Connect Method: ${diagnostic.kaswareConnect ? '✅' : '❌'}
App Registered: ${diagnostic.appRegistered ? '✅' : '❌'}
Script Loaded: ${diagnostic.scriptLoaded ? '✅' : '❌'}
Wallet Connected: ${diagnostic.walletConnected ? '✅' : '❌'}`, 'AUTO_DIAGNOSTIC', 'info');
        
        return diagnostic;
    },
    
    // Automated file access diagnostic
    runFileAccessDiagnostic: function(errorMessage) {
        const fileMatch = errorMessage.match(/applications\/(\w+)\.js/);
        if (fileMatch) {
            const appName = fileMatch[1];
            fetch(`applications/${appName}.js`, { method: 'HEAD' })
                .then(response => {
                    this.logToDebugConsole(`File Access Diagnostic for ${appName}:
Status: ${response.status}
OK: ${response.ok ? '✅' : '❌'}
Headers: ${JSON.stringify(Object.fromEntries(response.headers))}`, 'AUTO_DIAGNOSTIC', response.ok ? 'info' : 'error');
                })
                .catch(error => {
                    this.logToDebugConsole(`File Access Error for ${appName}: ${error.message}`, 'AUTO_DIAGNOSTIC', 'error');
                });
        }
    },
    
    // Automated syntax diagnostic
    runSyntaxDiagnostic: function(errorMessage) {
        this.logToDebugConsole(`Syntax Diagnostic:
Error: ${errorMessage}
Suggestion: Check for missing quotes, brackets, or semicolons
Common Issues: Unterminated strings, missing commas, incorrect JSON format`, 'AUTO_DIAGNOSTIC', 'warning');
    },
      // Application-specific diagnostic
    diagnoseApplication: function(appName) {
        console.log(`🔍 Diagnosing application: ${appName}`);
        
        const diagnostics = {
            applicationExists: !!window.KasOS?.applications?.[appName],
            fileExists: false,
            loadAttempts: this.launchAttempts[appName] || [],
            errors: this.applicationErrors[`APP_${appName.toUpperCase()}`] || [],
            networkErrors: this.errors.filter(e => e.category === 'APP_LOAD' && e.message.includes(appName))
        };
        
        // Check if file exists
        fetch(`applications/${appName}.js`, { method: 'HEAD' })
            .then(response => {
                diagnostics.fileExists = response.ok;
                diagnostics.fileStatus = response.status;
                this.showDiagnosticResults(appName, diagnostics);
            })
            .catch(error => {
                diagnostics.fileError = error.message;
                this.showDiagnosticResults(appName, diagnostics);
            });
    },
    
    // Report an error (for external use)
    reportError: function(category, message, level = 'error', context = {}) {
        this.log(message, category, level, context);
    },
    
    showDiagnosticResults: function(appName, diagnostics) {
        console.group(`🔍 Diagnostic Results for ${appName}`);
        console.log('Application loaded:', diagnostics.applicationExists);
        console.log('File exists:', diagnostics.fileExists);
        console.log('File status:', diagnostics.fileStatus);
        console.log('Launch attempts:', diagnostics.loadAttempts.length);
        console.log('Errors:', diagnostics.errors.length);
        console.log('Network errors:', diagnostics.networkErrors.length);
        
        if (diagnostics.fileError) {
            console.error('File error:', diagnostics.fileError);
        }
        
        if (diagnostics.loadAttempts.length > 0) {
            console.log('Recent launch attempts:', diagnostics.loadAttempts.slice(-3));
        }
        
        if (diagnostics.errors.length > 0) {
            console.log('Recent errors:', diagnostics.errors.slice(-3));
        }
        
        console.groupEnd();
        
        // Show diagnostic in debug console
        this.logToDebugConsole(`Diagnostic for ${appName}:
- App loaded: ${diagnostics.applicationExists}
- File exists: ${diagnostics.fileExists}
- Launch attempts: ${diagnostics.loadAttempts.length}
- Errors: ${diagnostics.errors.length}`, 'DIAGNOSTIC', 'info');
    },
    
    createErrorDisplay: function() {
        // Create error display panel
        const errorPanel = document.createElement('div');
        errorPanel.id = 'errorPanel';
        errorPanel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 350px;
            max-height: 400px;
            background: rgba(220, 53, 69, 0.95);
            color: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 9999;
            display: none;
            overflow-y: auto;
            font-family: Arial, sans-serif;
            font-size: 14px;
        `;
        
        document.body.appendChild(errorPanel);
    },
      toggleDebugPanel: function() {
        // Instead of showing the old error panel, launch the Error Tracker app
        if (window.KasOS && typeof window.KasOS.launchApplication === 'function') {
            window.KasOS.launchApplication('error-tracker');
        } else {
            // Fallback to old panel if KasOS not available
            const panel = document.getElementById('errorPanel');
            if (!panel) return;
            
            if (panel.style.display === 'none') {
                this.showErrorPanel();
            } else {
                panel.style.display = 'none';
            }
        }
    },
      showErrorPanel: function() {
        const panel = document.getElementById('errorPanel');
        if (!panel) return;
        
        const recentErrors = this.errors.slice(0, 10);
        
        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h3 style="margin: 0; color: white;">🚨 Error Log</h3>
                <button onclick="errorSystem.clearErrors()" style="background: rgba(255,255,255,0.2); color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Clear</button>
            </div>            <div style="margin-bottom: 10px;">
                <button onclick="errorSystem.diagnoseApplication('kaswallet')" style="background: #ffc107; color: black; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-right: 5px;">Diagnose KasWallet</button>
                <button onclick="errorSystem.autoFixKasWallet()" style="background: #28a745; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-right: 5px;">Fix KasWallet</button>
                <button onclick="errorSystem.exportErrors()" style="background: #17a2b8; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Export</button>
            </div>
            ${recentErrors.map(error => `
                <div style="margin-bottom: 10px; padding: 8px; background: rgba(0,0,0,0.3); border-radius: 4px; font-size: 12px; cursor: pointer;" onclick="errorSystem.showErrorDetails('${error.id}')">
                    <div style="font-weight: bold; color: #ffd93d;">[${error.level.toUpperCase()}] ${error.category}</div>
                    <div style="margin: 5px 0;">${error.message}</div>
                    <div style="font-size: 10px; opacity: 0.8;">${new Date(error.timestamp).toLocaleString()}</div>
                    ${error.fixSuggestions && error.fixSuggestions.length > 0 ? `
                        <div style="margin-top: 5px; padding: 5px; background: rgba(255,255,255,0.1); border-radius: 3px;">
                            <div style="font-size: 10px; color: #90ee90; font-weight: bold;">💡 Fix Suggestions:</div>
                            ${error.fixSuggestions.slice(0, 2).map(suggestion => `
                                <div style="font-size: 10px; color: #90ee90;">• ${suggestion}</div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        `;
        
        panel.style.display = 'block';
    },
    
    // Show detailed error information
    showErrorDetails: function(errorId) {
        const error = this.errors.find(e => e.id === errorId);
        if (!error) return;
        
        const popup = document.createElement('div');
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            color: black;
            border: 2px solid #ccc;
            border-radius: 8px;
            padding: 20px;
            max-width: 600px;
            max-height: 70vh;
            overflow: auto;
            z-index: 10001;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;
        
        popup.innerHTML = `
            <div class="error-detail-popup">
                <h3>Error Details</h3>
                <p><strong>ID:</strong> ${error.id}</p>
                <p><strong>Time:</strong> ${new Date(error.timestamp).toLocaleString()}</p>
                <p><strong>Category:</strong> ${error.category}</p>
                <p><strong>Level:</strong> ${error.level}</p>
                <p><strong>Message:</strong> ${error.message}</p>
                ${error.fixSuggestions && error.fixSuggestions.length > 0 ? `
                    <div style="background: #f0f8ff; padding: 10px; border-radius: 4px; margin: 10px 0;">
                        <h4 style="margin-top: 0; color: #0066cc;">💡 Fix Suggestions:</h4>
                        <ul style="margin: 5px 0; padding-left: 20px;">
                            ${error.fixSuggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                ${error.stack ? `<p><strong>Stack:</strong><br><pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 11px;">${error.stack}</pre></p>` : ''}
                ${error.context && Object.keys(error.context).length > 0 ? `<p><strong>Context:</strong><br><pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 11px;">${JSON.stringify(error.context, null, 2)}</pre></p>` : ''}
                <div style="margin-top: 15px; text-align: right;">
                    <button onclick="this.closest('[style*=\"position: fixed\"]').remove()" style="background: #dc3545; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Click outside to close
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.remove();
            }
        });
    },
    
    clearErrors: function() {
        this.errors = [];
        this.applicationErrors = {};
        this.launchAttempts = {};
        const panel = document.getElementById('errorPanel');
        if (panel) {
            panel.style.display = 'none';
        }
        this.clearDebugConsole();
        this.ensureDebugConsole(); // Re-create debug console if needed
    },
    
    exportErrors: function() {
        const errorData = {
            timestamp: new Date().toISOString(),
            errors: this.errors,
            applicationErrors: this.applicationErrors,
            launchAttempts: this.launchAttempts,
            systemInfo: {
                userAgent: navigator.userAgent,
                url: window.location.href,
                storage: this.getStorageInfo()
            }
        };
        
        const blob = new Blob([JSON.stringify(errorData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `KasOS-error-log-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    },
    
    getStorageInfo: function() {
        try {
            let totalSize = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    totalSize += localStorage[key].length;
                }
            }
            return {
                localStorageSize: totalSize,
                localStorageItems: Object.keys(localStorage).length
            };
        } catch (e) {
            return { error: e.message };
        }
    },
    
    // Auto-fix system that attempts to resolve common issues
    tryAutoFix: function(errorId) {
        const error = this.errors.find(e => e.id === errorId);
        if (!error) return false;
        
        const msgLower = error.message.toLowerCase();
        
        // Try KasWallet fixes
        if (msgLower.includes('kasware') || msgLower.includes('kaswallet')) {
            return this.autoFixKasWallet();
        }
        
        // Try file access fixes
        if (msgLower.includes('404') || msgLower.includes('not found')) {
            return this.autoFixFileAccess(error.message);
        }
        
        // Try memory fixes
        if (msgLower.includes('memory') || msgLower.includes('heap')) {
            return this.autoFixMemory();
        }
        
        return false;
    },
    
    autoFixKasWallet: function() {
        try {
            // Clear wallet storage and retry connection
            localStorage.removeItem('walletConnected');
            localStorage.removeItem('walletAddress');
            
            // Trigger a fresh connection attempt
            if (window.kasware && typeof window.kasware.connect === 'function') {
                setTimeout(() => {
                    window.kasware.connect().then(() => {
                        this.logToDebugConsole('Auto-fix: KasWallet connection restored', 'AUTO_FIX', 'success');
                    }).catch(() => {
                        this.logToDebugConsole('Auto-fix: KasWallet connection failed', 'AUTO_FIX', 'error');
                    });
                }, 1000);
            }
            
            return true;
        } catch (e) {
            return false;
        }
    },
    
    autoFixFileAccess: function(errorMessage) {
        try {
            // Clear application cache
            if ('caches' in window) {
                caches.keys().then(names => {
                    names.forEach(name => {
                        caches.delete(name);
                    });
                });
            }
            
            // Force refresh the application
            const appMatch = errorMessage.match(/applications\/(\w+)\.js/);
            if (appMatch && window.KasOS && window.KasOS.applications) {
                const appName = appMatch[1];
                delete window.KasOS.applications[appName];
                this.logToDebugConsole(`Auto-fix: Cleared cache for ${appName}`, 'AUTO_FIX', 'info');
            }
            
            return true;
        } catch (e) {
            return false;
        }
    },
    
    autoFixMemory: function() {
        try {
            // Force garbage collection if available
            if (window.gc && typeof window.gc === 'function') {
                window.gc();
            }
            
            // Clear unnecessary data
            this.clearOldErrors();
            
            this.logToDebugConsole('Auto-fix: Memory cleanup attempted', 'AUTO_FIX', 'info');
            return true;
        } catch (e) {
            return false;
        }
    },
      clearOldErrors: function() {
        // Keep only the most recent 100 errors
        if (this.errors.length > 100) {
            this.errors = this.errors.slice(0, 100);
        }
        
        // Clear old launch attempts (keep only last 10 per app)
        Object.keys(this.launchAttempts).forEach(appName => {
            if (this.launchAttempts[appName].length > 10) {
                this.launchAttempts[appName] = this.launchAttempts[appName].slice(-10);
            }
        });
    }
};

// Initialize error system when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize error system first
    if (window.errorSystem && typeof window.errorSystem.init === 'function') {
        window.errorSystem.init();
    }
    
    // Add event listeners after a delay to ensure elements exist
    setTimeout(() => {
        // Debug button
        const debugButton = document.getElementById('debugButton');
        if (debugButton) {
            debugButton.addEventListener('click', () => {
                if (window.errorSystem) {
                    window.errorSystem.toggleDebugConsole();
                }
            });
        }
        
        // Error panel button
        const errorPanelButton = document.getElementById('errorPanelButton');
        if (errorPanelButton) {
            errorPanelButton.addEventListener('click', () => {
                if (window.errorSystem) {
                    window.errorSystem.toggleDebugPanel();
                }
            });
        }
        
        // KasWallet diagnostic button
        const kwDiagButton = document.getElementById('kaswalletDiagButton');
        if (kwDiagButton) {
            kwDiagButton.addEventListener('click', () => {
                if (window.errorSystem) {
                    window.errorSystem.diagnoseApplication('kaswallet');
                }
            });
        }
    }, 1000);
});

// Enhanced error notification system
window.showErrorNotification = function(message, level = 'error') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${level === 'error' ? '#dc3545' : level === 'warning' ? '#ffc107' : '#28a745'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10002;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        max-width: 300px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; margin-left: 10px;">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
};

// Global error reporting wrapper
window.reportError = function(category, message, level = 'error', context = {}) {
    if (window.errorSystem) {
        window.errorSystem.reportError(category, message, level, context);
        
        // Show notification for critical errors
        if (level === 'error') {
            window.showErrorNotification(message, level);
        }
    } else {
        console.error('[Error System Not Available]', category, message);
    }
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

console.log('Enhanced error reporting system loaded');

