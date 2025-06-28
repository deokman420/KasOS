/**
 * KasOS System Diagnostics
 * Provides comprehensive system diagnostic and health check capabilities
 */

window.KasOSDiagnostics = {
    
    // Run comprehensive system diagnostic
    runSystemDiagnostic: function() {
        console.group('🔍 KasOS System Diagnostic');
        
        const results = {
            timestamp: new Date().toISOString(),
            browser: this.getBrowserInfo(),
            storage: this.getStorageInfo(),
            KasOS: this.getKasOSInfo(),
            errorSystem: this.getErrorSystemInfo(),
            applications: this.getApplicationsInfo(),
            performance: this.getPerformanceInfo(),
            kaspaWallet: this.diagnoseKasWallet(),
            kaspaExplorer: this.diagnoseKaspaExplorer()
        };
        
        console.log('📊 Diagnostic Results:', results);
        console.groupEnd();
        
        // Log to error system if available
        if (window.errorSystem) {
            window.errorSystem.ensureDebugConsole();
            window.errorSystem.logToDebugConsole(
                'Enhanced system diagnostic completed - includes Kaspa Explorer status',
                'DIAGNOSTIC',
                'info'
            );
        }
        
        return results;
    },
    
    // Get browser information
    getBrowserInfo: function() {
        const ua = navigator.userAgent;
        let browser = "Unknown";
        let version = "Unknown";
        
        if (ua.includes("Firefox")) {
            browser = "Firefox";
            version = ua.match(/Firefox\/(\d+\.\d+)/)?.[1] || "Unknown";
        } else if (ua.includes("Chrome")) {
            browser = "Chrome";
            version = ua.match(/Chrome\/(\d+\.\d+)/)?.[1] || "Unknown";
        } else if (ua.includes("Safari")) {
            browser = "Safari";
            version = ua.match(/Version\/(\d+\.\d+)/)?.[1] || "Unknown";
        } else if (ua.includes("Edge")) {
            browser = "Edge";
            version = ua.match(/Edge\/(\d+\.\d+)/)?.[1] || "Unknown";
        }
        
        return {
            name: browser,
            version: version,
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            language: navigator.language
        };
    },
    
    // Get storage information
    getStorageInfo: function() {
        const storage = {
            localStorage: {
                available: typeof Storage !== "undefined",
                itemCount: 0,
                totalSize: 0,
                items: {}
            },
            indexedDB: {
                available: 'indexedDB' in window,
                databases: []
            },
            sessionStorage: {
                available: typeof sessionStorage !== "undefined",
                itemCount: sessionStorage.length
            }
        };
        
        // LocalStorage details
        if (storage.localStorage.available) {
            storage.localStorage.itemCount = localStorage.length;
            
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    const size = localStorage[key].length;
                    storage.localStorage.totalSize += size;
                    
                    if (key.startsWith('KasOS-')) {
                        storage.localStorage.items[key] = {
                            size: size,
                            type: key.includes('users') ? 'user-data' : 
                                  key.includes('files') ? 'file-data' : 
                                  key.includes('settings') ? 'settings' : 'other'
                        };
                    }
                }
            }
        }
        
        return storage;
    },
    
    // Get KasOS system information
    getKasOSInfo: function() {
        const KasOS = window.KasOS;
        
        return {
            available: !!KasOS,
            currentUser: KasOS?.currentUser?.username || null,
            windowCount: KasOS?.windows?.length || 0,
            applicationCount: Object.keys(KasOS?.applications || {}).length,
            zIndex: KasOS?.zIndex || 0,
            initialized: !!KasOS?.db
        };
    },
    
    // Get error system information
    getErrorSystemInfo: function() {
        const errorSystem = window.errorSystem;
        
        return {
            available: !!errorSystem,
            debugMode: errorSystem?.debugMode || false,
            errorCount: errorSystem?.errors?.length || 0,
            maxErrors: errorSystem?.maxErrors || 0,
            categoryCounts: this.getErrorCategoryCounts(),
            recentErrors: errorSystem?.errors?.slice(0, 5).map(e => ({
                timestamp: e.timestamp,
                category: e.category,
                level: e.level,
                message: e.message.substring(0, 100)
            })) || []
        };
    },
    
    // Get error counts by category
    getErrorCategoryCounts: function() {
        if (!window.errorSystem || !window.errorSystem.errors) return {};
        
        const counts = {};
        window.errorSystem.errors.forEach(error => {
            counts[error.category] = (counts[error.category] || 0) + 1;
        });
        
        return counts;
    },
    
    // Get applications information
    getApplicationsInfo: function() {
        const KasOS = window.KasOS;
        const apps = KasOS?.applications || {};
        
        return {
            builtInCount: Object.keys(apps).length,
            customCount: KasOS?.applications?.installedApps?.size || 0,
            loadedApps: Object.keys(apps),
            failedLoads: this.getFailedApplicationLoads()
        };
    },
    
    // Get failed application loads from error system
    getFailedApplicationLoads: function() {
        if (!window.errorSystem) return [];
        
        return window.errorSystem.errors
            .filter(e => e.category === 'APP_LOAD' && e.level === 'error')
            .map(e => ({
                timestamp: e.timestamp,
                message: e.message,
                app: e.message.match(/applications\/(\w+)\.js/)?.[1] || 'unknown'
            }));
    },
    
    // Get performance information
    getPerformanceInfo: function() {
        const performance = {
            memory: null,
            timing: null,
            navigation: null
        };
        
        // Memory info (Chrome only)
        if (window.performance && window.performance.memory) {
            performance.memory = {
                usedJSHeapSize: Math.round(window.performance.memory.usedJSHeapSize / 1024 / 1024),
                totalJSHeapSize: Math.round(window.performance.memory.totalJSHeapSize / 1024 / 1024),
                jsHeapSizeLimit: Math.round(window.performance.memory.jsHeapSizeLimit / 1024 / 1024),
                unit: 'MB'
            };
        }
        
        // Navigation timing
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            performance.timing = {
                pageLoadTime: timing.loadEventEnd - timing.navigationStart,
                domReadyTime: timing.domContentLoadedEventEnd - timing.navigationStart,
                connectTime: timing.connectEnd - timing.connectStart
            };
        }
        
        return performance;
    },
    
    // Enhanced KasWallet diagnostics to include Kaspa Explorer
    diagnoseKasWallet: function() {
        console.group('💰 Wallet & Explorer Connection Diagnostic');
        
        const diagnostic = {
            timestamp: new Date().toISOString(),
            kaswareExtension: !!window.kasware,
            metamaskExtension: !!window.ethereum?.isMetaMask,
            coinbaseExtension: !!window.ethereum?.isCoinbaseWallet,
            kaswareConnect: !!(window.kasware && typeof window.kasware.connect === 'function'),
            metamaskConnect: !!(window.ethereum?.isMetaMask && typeof window.ethereum.request === 'function'),
            kaswareGetAccount: !!(window.kasware && typeof window.kasware.getAccount === 'function'),
            walletConnected: localStorage.getItem('walletConnected') === 'true',
            walletAddress: localStorage.getItem('walletAddress'),
            walletProvider: localStorage.getItem('walletProvider') || 'unknown',
            connectionTest: null,
            kaspaExplorerStatus: this.checkKaspaExplorerStatus(),
            errors: this.getKasWalletErrors()
        };
        
        // Perform real-time connection test
        if (window.kasware) {
            try {
                // Test actual connection capability
                if (typeof window.kasware.getAccount === 'function') {
                    diagnostic.connectionTest = 'Available - can test connection';
                } else {
                    diagnostic.connectionTest = 'Extension found but methods unavailable';
                }
            } catch (error) {
                diagnostic.connectionTest = `Connection test failed: ${error.message}`;
            }
        } else {
            diagnostic.connectionTest = 'Extension not detected';
        }
        
        console.log('🔍 Real-time Wallet Connection Status:');
        console.log(`  Kasware Extension Detected: ${diagnostic.kaswareExtension ? '✅' : '❌'}`);
        console.log(`  MetaMask Extension Detected: ${diagnostic.metamaskExtension ? '✅' : '❌'}`);
        console.log(`  Coinbase Wallet Extension Detected: ${diagnostic.coinbaseExtension ? '✅' : '❌'}`);
        console.log(`  Kasware Connect Method: ${diagnostic.kaswareConnect ? '✅' : '❌'}`);
        console.log(`  MetaMask Connect Method: ${diagnostic.metamaskConnect ? '✅' : '❌'}`);
        console.log(`  GetAccount Method: ${diagnostic.kaswareGetAccount ? '✅' : '❌'}`);
        console.log(`  Wallet Connected: ${diagnostic.walletConnected ? '✅' : '❌'}`);
        console.log(`  Connection Test: ${diagnostic.connectionTest}`);
        
        if (diagnostic.walletAddress) {
            console.log(`  Wallet Address: ${diagnostic.walletAddress.substring(0, 10)}...${diagnostic.walletAddress.substring(diagnostic.walletAddress.length - 6)}`);
        }
        
        if (diagnostic.errors.length > 0) {
            console.log(`  Recent Errors: ${diagnostic.errors.length}`);
            diagnostic.errors.forEach(error => {
                console.log(`    - ${error.message}`);
            });
        }
        
        console.groupEnd();
        
        // Log summary to error system
        if (window.errorSystem) {
            window.errorSystem.ensureDebugConsole();
            const summary = `Wallet & Explorer Diagnostic: Extension ${diagnostic.kaswareExtension ? 'Found' : 'Missing'}, Connected: ${diagnostic.walletConnected ? 'Yes' : 'No'}, Explorer: ${diagnostic.kaspaExplorerStatus.status}, Errors: ${diagnostic.errors.length}`;
            window.errorSystem.logToDebugConsole(summary, 'WALLET_DIAGNOSTIC', 'info');
        }
        
        return diagnostic;
    },
    
    // Check Kaspa Explorer status
    checkKaspaExplorerStatus: function() {
        try {
            const explorerWindow = document.querySelector('.window[data-window-id*="kaspa-explorer"]');
            const explorerApp = window.kaspaExplorer;
            
            return {
                status: explorerApp ? 'active' : 'inactive',
                windowOpen: !!explorerWindow,
                apiConnections: explorerApp ? this.checkExplorerApiStatus() : null,
                lastUpdate: explorerApp ? document.getElementById('lastUpdate')?.textContent : null
            };
        } catch (error) {
            return {
                status: 'error',
                error: error.message
            };
        }
    },
    
    // Check Explorer API status
    checkExplorerApiStatus: function() {
        try {
            const priceElement = document.getElementById('kaspaPrice');
            const blockHeightElement = document.getElementById('blockHeight');
            const hashrateElement = document.getElementById('hashrate');
            
            return {
                priceApi: priceElement?.textContent !== 'Loading...' && !priceElement?.textContent.includes('Error'),
                networkApi: blockHeightElement?.textContent !== 'Loading...' && !blockHeightElement?.textContent.includes('Error'),
                hashrateApi: hashrateElement?.textContent !== 'Loading...' && !hashrateElement?.textContent.includes('Error')
            };
        } catch (error) {
            return {
                error: error.message
            };
        }
    },
    
    // Add Kaspa Explorer specific diagnostic
    diagnoseKaspaExplorer: function() {
        console.group('⚡ Kaspa Explorer Diagnostic');
        
        const diagnostic = {
            timestamp: new Date().toISOString(),
            explorerLoaded: !!window.kaspaExplorer,
            windowOpen: !!document.querySelector('.window[data-window-id*="kaspa-explorer"]'),
            apiStatus: this.checkExplorerApiStatus(),
            networkConnectivity: navigator.onLine,
            corsIssues: this.checkCorsIssues(),
            errors: this.getKaspaExplorerErrors()
        };
        
        console.log('🔍 Kaspa Explorer Status:');
        console.log(`  Explorer Loaded: ${diagnostic.explorerLoaded ? '✅' : '❌'}`);
        console.log(`  Window Open: ${diagnostic.windowOpen ? '✅' : '❌'}`);
        console.log(`  Network Online: ${diagnostic.networkConnectivity ? '✅' : '❌'}`);
        
        if (diagnostic.apiStatus) {
            console.log(`  Price API: ${diagnostic.apiStatus.priceApi ? '✅' : '❌'}`);
            console.log(`  Network API: ${diagnostic.apiStatus.networkApi ? '✅' : '❌'}`);
            console.log(`  Hashrate API: ${diagnostic.apiStatus.hashrateApi ? '✅' : '❌'}`);
        }
        
        if (diagnostic.errors.length > 0) {
            console.log(`  Recent Errors: ${diagnostic.errors.length}`);
            diagnostic.errors.forEach(error => {
                console.log(`    - ${error.message}`);
            });
        }
        
        console.groupEnd();
        
        // Log to error system
        if (window.errorSystem) {
            window.errorSystem.ensureDebugConsole();
            const workingApis = diagnostic.apiStatus ? 
                Object.values(diagnostic.apiStatus).filter(status => status === true).length : 0;
            const summary = `Kaspa Explorer Diagnostic: Loaded: ${diagnostic.explorerLoaded ? 'Yes' : 'No'}, APIs Working: ${workingApis}/3, Errors: ${diagnostic.errors.length}`;
            window.errorSystem.logToDebugConsole(summary, 'KASPA_EXPLORER_DIAGNOSTIC', 'info');
        }
        
        return diagnostic;
    },
    
    // Check for CORS issues
    checkCorsIssues: function() {
        const corsErrors = this.getErrorCounts()['CORS'] || 0;
        const apiErrors = this.getErrorCounts()['KASPA_API'] || 0;
        
        return {
            corsErrorCount: corsErrors,
            apiErrorCount: apiErrors,
            likelyCorsIssue: corsErrors > 0 || apiErrors > 3
        };
    },
    
    // Get Kaspa Explorer related errors
    getKaspaExplorerErrors: function() {
        if (!window.errorSystem) return [];
        
        return window.errorSystem.errors
            .filter(e => 
                e.category === 'KASPA_API' || 
                e.category === 'KASPA_EXPLORER' ||
                e.category === 'KASPA_DIAGNOSTIC' ||
                e.message.toLowerCase().includes('kaspa') ||
                e.message.toLowerCase().includes('api.kaspa.org')
            )
            .slice(0, 10)
            .map(e => ({
                timestamp: e.timestamp,
                level: e.level,
                message: e.message,
                category: e.category
            }));
    },
    
    // Diagnose specific KasWallet issues
    diagnoseKasWallet: function() {
        console.group('💰 Wallet Connection Diagnostic');
        
        const diagnostic = {
            timestamp: new Date().toISOString(),
            kaswareExtension: !!window.kasware,
            metamaskExtension: !!window.ethereum?.isMetaMask,
            coinbaseExtension: !!window.ethereum?.isCoinbaseWallet,
            kaswareConnect: !!(window.kasware && typeof window.kasware.connect === 'function'),
            metamaskConnect: !!(window.ethereum?.isMetaMask && typeof window.ethereum.request === 'function'),
            kaswareGetAccount: !!(window.kasware && typeof window.kasware.getAccount === 'function'),
            walletConnected: localStorage.getItem('walletConnected') === 'true',
            walletAddress: localStorage.getItem('walletAddress'),
            walletProvider: localStorage.getItem('walletProvider') || 'unknown',
            connectionTest: null,
            errors: this.getKasWalletErrors()
        };
        
        // Perform real-time connection test
        if (window.kasware) {
            try {
                // Test actual connection capability
                if (typeof window.kasware.getAccount === 'function') {
                    diagnostic.connectionTest = 'Available - can test connection';
                } else {
                    diagnostic.connectionTest = 'Extension found but methods unavailable';
                }
            } catch (error) {
                diagnostic.connectionTest = `Connection test failed: ${error.message}`;
            }
        } else {
            diagnostic.connectionTest = 'Extension not detected';
        }
        
        console.log('🔍 Real-time Wallet Connection Status:');
        console.log(`  Kasware Extension Detected: ${diagnostic.kaswareExtension ? '✅' : '❌'}`);
        console.log(`  MetaMask Extension Detected: ${diagnostic.metamaskExtension ? '✅' : '❌'}`);
        console.log(`  Coinbase Wallet Extension Detected: ${diagnostic.coinbaseExtension ? '✅' : '❌'}`);
        console.log(`  Kasware Connect Method: ${diagnostic.kaswareConnect ? '✅' : '❌'}`);
        console.log(`  MetaMask Connect Method: ${diagnostic.metamaskConnect ? '✅' : '❌'}`);
        console.log(`  GetAccount Method: ${diagnostic.kaswareGetAccount ? '✅' : '❌'}`);
        console.log(`  Wallet Connected: ${diagnostic.walletConnected ? '✅' : '❌'}`);
        console.log(`  Connection Test: ${diagnostic.connectionTest}`);
        
        if (diagnostic.walletAddress) {
            console.log(`  Wallet Address: ${diagnostic.walletAddress.substring(0, 10)}...${diagnostic.walletAddress.substring(diagnostic.walletAddress.length - 6)}`);
        }
        
        if (diagnostic.errors.length > 0) {
            console.log(`  Recent Errors: ${diagnostic.errors.length}`);
            diagnostic.errors.forEach(error => {
                console.log(`    - ${error.message}`);
            });
        }
        
        console.groupEnd();
        
        // Log summary to error system
        if (window.errorSystem) {
            window.errorSystem.ensureDebugConsole();
            const summary = `Real-time Wallet Diagnostic: Extension ${diagnostic.kaswareExtension ? 'Found' : 'Missing'}, Connected: ${diagnostic.walletConnected ? 'Yes' : 'No'}, Test: ${diagnostic.connectionTest}, Errors: ${diagnostic.errors.length}`;
            window.errorSystem.logToDebugConsole(summary, 'WALLET_DIAGNOSTIC', 'info');
        }
        
        return diagnostic;
    },
    
    // Get KasWallet related errors
    getKasWalletErrors: function() {
        if (!window.errorSystem) return [];
        
        return window.errorSystem.errors
            .filter(e => e.category === 'KASWALLET' || e.message.toLowerCase().includes('kasware'))
            .slice(0, 10)
            .map(e => ({
                timestamp: e.timestamp,
                level: e.level,
                message: e.message,
                category: e.category
            }));
    },
    
    // Add getErrorCounts to count error categories
    getErrorCounts: function() {
        if (!window.errorSystem || !window.errorSystem.errors) return {};
        const counts = {};
        window.errorSystem.errors.forEach(error => {
            counts[error.category] = (counts[error.category] || 0) + 1;
        });
        return counts;
    },
    
    // Run health check
    runHealthCheck: function() {
        const health = {
            overall: 'healthy',
            issues: [],
            warnings: [],
            recommendations: []
        };
        
        // Check storage usage
        const storageInfo = this.getStorageInfo();
        if (storageInfo.localStorage.totalSize > 4 * 1024 * 1024) { // > 4MB
            health.warnings.push('High localStorage usage detected');
            health.recommendations.push('Consider clearing old data or requesting persistent storage');
        }
        
        // Check error count
        const errorInfo = this.getErrorSystemInfo();
        if (errorInfo.errorCount > 50) {
            health.warnings.push('High error count detected');
            health.recommendations.push('Review and fix recurring errors');
        }
        
        // Check memory usage
        const perfInfo = this.getPerformanceInfo();
        if (perfInfo.memory && perfInfo.memory.usedJSHeapSize > 100) { // > 100MB
            health.warnings.push('High memory usage detected');
            health.recommendations.push('Close unused applications or refresh the page');
        }
        
        // Determine overall health
        if (health.warnings.length > 2) {
            health.overall = 'warning';
        }
        if (health.issues.length > 0) {
            health.overall = 'critical';
        }
        
        return health;
    },
    
    // Export diagnostic report
    exportDiagnosticReport: function() {
        const report = {
            timestamp: new Date().toISOString(),
            systemDiagnostic: this.runSystemDiagnostic(),
            kaswalletDiagnostic: this.diagnoseKasWallet(),
            healthCheck: this.runHealthCheck(),
            exportedBy: 'KasOS Diagnostics v1.0'
        };
        
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `KasOS-diagnostic-report-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        console.log('📤 Diagnostic report exported');
        
        if (window.errorSystem) {
            // Ensure debug console exists before logging
            window.errorSystem.ensureDebugConsole();
            window.errorSystem.logToDebugConsole('Diagnostic report exported successfully', 'DIAGNOSTIC', 'success');
        }
        
        return report;
    }
};

// Auto-run basic diagnostic on load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (window.KasOSDiagnostics) {
            console.log('🔍 KasOS Diagnostics system loaded');
            
            // Run a quick health check
            const health = window.KasOSDiagnostics.runHealthCheck();
            if (health.overall !== 'healthy' && window.errorSystem) {
                window.errorSystem.logToDebugConsole(
                    `System health: ${health.overall} - ${health.warnings.length} warnings, ${health.issues.length} issues`,
                    'HEALTH_CHECK',
                    health.overall === 'critical' ? 'error' : 'warning'
                );
            }
        }
    }, 2000);
});

console.log('🔍 KasOS Diagnostics system initialized');