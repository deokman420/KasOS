/**
 * KasOS AI Agent - Intelligent System Monitor and Auto-Repair
 * Provides autonomous troubleshooting, performance optimization, and self-healing
 */

window.KasOSAIAgent = {
    // Core AI Agent properties
    isActive: false,
    analysisInterval: null,
    performanceData: [],
    knowledgeBase: {},
    learningData: {},
    
    // Additional configurable properties
    autoHealingEnabled: true,
    predictiveEnabled: false,
    learningMode: false,
    notificationLevel: 'important',
    
    // Performance thresholds
    thresholds: {
        memoryUsage: 85, // percentage
        errorRate: 10, // errors per minute
        loadTime: 3000, // milliseconds
        storageUsage: 90, // percentage
        cpuUsage: 80 // percentage (if available)
    },
    
    init: function() {
        console.log('🤖 KasOS AI Agent initializing...');
        
        // Load user preferences from localStorage
        this.loadPreferences();
        
        // Don't start if explicitly disabled
        if (localStorage.getItem('KasOS-ai-enabled') === 'false') {
            console.log('🤖 AI Agent disabled by user preferences');
            return;
        }
        
        this.buildKnowledgeBase();
        this.initializePerformanceTracking();
        this.startContinuousAnalysis();
        this.isActive = true;
        
        // Register with error system
        if (window.errorSystem) {
            // Ensure debug console exists before logging
            window.errorSystem.ensureDebugConsole();
            window.errorSystem.logToDebugConsole('AI Agent initialized successfully', 'AI_AGENT', 'success');
        }
        
        console.log('🤖 AI Agent ready - Monitoring system health');
    },
    
    loadPreferences: function() {
        // Load preferences from localStorage
        this.autoHealingEnabled = localStorage.getItem('KasOS-auto-healing') !== 'false';
        this.predictiveEnabled = localStorage.getItem('KasOS-predictive') === 'true';
        this.learningMode = localStorage.getItem('KasOS-ai-learning') === 'true';
        this.notificationLevel = localStorage.getItem('KasOS-ai-notification-level') || 'important';
        
        // Load threshold settings
        const memThreshold = localStorage.getItem('KasOS-memory-threshold');
        if (memThreshold) this.thresholds.memoryUsage = parseInt(memThreshold);
        
        const storageThreshold = localStorage.getItem('KasOS-storage-threshold');
        if (storageThreshold) this.thresholds.storageUsage = parseInt(storageThreshold);
    },
    
    buildKnowledgeBase: function() {
        this.knowledgeBase = {
            // Common error patterns and solutions
            errorPatterns: {
                'kasware': {
                    symptoms: ['wallet not found', 'wallet connection failed', 'extension missing'],
                    diagnosis: 'Wallet extension issue',
                    solutions: [
                        { action: 'checkExtension', priority: 1, description: 'Verify wallet extension is installed and enabled' },
                        { action: 'refreshConnection', priority: 2, description: 'Reset wallet connection' },
                        { action: 'clearWalletCache', priority: 3, description: 'Clear wallet-related cache data' }
                    ],
                    autoFix: true
                },
                'network': {
                    symptoms: ['404', 'fetch failed', 'network error', 'connection refused', 'timeout'],
                    diagnosis: 'Network connectivity or resource availability issue',
                    solutions: [
                        { action: 'checkConnectivity', priority: 1, description: 'Verify internet connection' },
                        { action: 'clearNetworkCache', priority: 2, description: 'Clear network cache' },
                        { action: 'retryWithBackoff', priority: 3, description: 'Implement retry mechanism' }
                    ],
                    autoFix: true
                },
                'memory': {
                    symptoms: ['out of memory', 'heap size exceeded', 'allocation failed'],
                    diagnosis: 'Memory usage optimization needed',
                    solutions: [
                        { action: 'forceGarbageCollection', priority: 1, description: 'Force garbage collection' },
                        { action: 'clearUnusedData', priority: 2, description: 'Clear unnecessary cached data' },
                        { action: 'restartApplications', priority: 3, description: 'Restart memory-intensive applications' }
                    ],
                    autoFix: true
                },
                'storage': {
                    symptoms: ['quota exceeded', 'storage full', 'write failed'],
                    diagnosis: 'Storage space management required',
                    solutions: [
                        { action: 'cleanupOldData', priority: 1, description: 'Remove old cached data' },
                        { action: 'requestMoreQuota', priority: 2, description: 'Request additional storage quota' },
                        { action: 'optimizeStorage', priority: 3, description: 'Optimize data storage' }
                    ],
                    autoFix: true
                },
                'application': {
                    symptoms: ['app crashed', 'initialization failed', 'script error'],
                    diagnosis: 'Application stability issue',
                    solutions: [
                        { action: 'restartApplication', priority: 1, description: 'Restart the problematic application' },
                        { action: 'resetAppData', priority: 2, description: 'Reset application data to defaults' },
                        { action: 'updateApplication', priority: 3, description: 'Check for application updates' }
                    ],
                    autoFix: false // Requires user confirmation
                }
            },
            
            // Performance optimization patterns
            performancePatterns: {
                highMemoryUsage: {
                    triggers: ['memory > 85%'],
                    actions: ['optimizeMemory', 'suggestCleanup', 'monitorLeaks']
                },
                slowPerformance: {
                    triggers: ['loadTime > 3s', 'lag detected'],
                    actions: ['profilePerformance', 'optimizeAssets', 'suggestRestart']
                },
                highErrorRate: {
                    triggers: ['errors > 10/min'],
                    actions: ['analyzeErrorPatterns', 'implementFixes', 'alertUser']
                }
            }
        };
    },
    
    initializePerformanceTracking: function() {
        // Track performance metrics continuously
        this.performanceTracker = {
            lastCheck: Date.now(),
            metrics: {
                memoryUsage: 0,
                storageUsage: 0,
                errorRate: 0,
                averageLoadTime: 0,
                activeWindows: 0,
                systemLoad: 0
            },
            // Make collect async and return a Promise with all metrics resolved
            collect: async () => {
                const metrics = {};
                
                // Memory usage (if available)
                if (performance.memory) {
                    metrics.memoryUsage = (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100;
                } else {
                    metrics.memoryUsage = 0;
                }
                
                // Storage usage (awaited)
                metrics.storageUsage = await this.getStorageUsage();
                
                // Error rate (errors in last minute)
                if (window.errorSystem) {
                    const oneMinuteAgo = Date.now() - 60000;
                    const recentErrors = window.errorSystem.errors.filter(e => 
                        new Date(e.timestamp).getTime() > oneMinuteAgo
                    );
                    metrics.errorRate = recentErrors.length;
                } else {
                    metrics.errorRate = 0;
                }
                
                // System load indicators
                metrics.activeWindows = document.querySelectorAll('.window').length;
                metrics.systemLoad = await this.calculateSystemLoadAsync();
                
                return metrics;
            }
        };
    },
    
    startContinuousAnalysis: function() {
        // Immediately collect first metrics so dashboard isn't empty
        this.runSystemAnalysis();
        
        // Run analysis every 30 seconds
        this.analysisInterval = setInterval(() => {
            this.runSystemAnalysis();
        }, 30000);
    },
    
    runSystemAnalysis: async function() {
        const metrics = await this.performanceTracker.collect();
        this.performanceData.push({
            timestamp: Date.now(),
            metrics: metrics
        });
        
        // Keep only last 100 data points
        if (this.performanceData.length > 100) {
            this.performanceData.shift();
        }
        
        // Analyze for issues
        this.analyzePerformanceIssues(metrics);
        this.predictPotentialIssues(metrics);
        this.runAutoHealing(metrics);
    },
    
    analyzePerformanceIssues: function(metrics) {
        const issues = [];
        
        // Check memory usage
        if (metrics.memoryUsage > this.thresholds.memoryUsage) {
            issues.push({
                type: 'memory',
                severity: 'warning',
                message: `High memory usage detected: ${metrics.memoryUsage.toFixed(1)}%`,
                recommendation: 'Consider closing unused applications or clearing cache'
            });
        }
        
        // Check error rate
        if (metrics.errorRate > this.thresholds.errorRate) {
            issues.push({
                type: 'errors',
                severity: 'error',
                message: `High error rate: ${metrics.errorRate} errors in last minute`,
                recommendation: 'Check error logs and fix recurring issues'
            });
        }
        
        // Check storage usage
        if (metrics.storageUsage > this.thresholds.storageUsage) {
            issues.push({
                type: 'storage',
                severity: 'warning',
                message: `Storage usage high: ${metrics.storageUsage.toFixed(1)}%`,
                recommendation: 'Clean up old files or request more storage quota'
            });
        }
        
        // Process identified issues
        issues.forEach(issue => this.handleIdentifiedIssue(issue));
    },
    
    predictPotentialIssues: function(metrics) {
        // Skip predictive analysis if disabled
        if (!this.predictiveEnabled) return;
        
        // Use historical data to predict trends
        if (this.performanceData.length < 10) return; // Need enough data
        
        const recent = this.performanceData.slice(-10);
        const trends = this.calculateTrends(recent);
        
        // Predict memory issues
        if (trends.memoryUsage > 2) { // Growing by 2% per analysis cycle
            this.generatePredictiveAlert('memory', 'Memory usage trending upward', 'info');
        }
        
        // Predict error rate issues
        if (trends.errorRate > 0.5) {
            this.generatePredictiveAlert('errors', 'Error rate increasing', 'warning');
        }
    },
    
    runAutoHealing: function(metrics) {
        // Only run auto-healing if enabled
        if (!this.autoHealingEnabled) return;
        
        // Automatic fixes for common issues
        if (metrics.memoryUsage > 90) {
            this.executeAutoFix('forceGarbageCollection');
        }
        
        if (metrics.storageUsage > 95) {
            this.executeAutoFix('cleanupOldData');
        }
        
        if (metrics.errorRate > 20) {
            this.executeAutoFix('analyzeAndFixErrors');
        }
    },
    
    executeAutoFix: function(fixType) {
        console.log(`🤖 AI Agent executing auto-fix: ${fixType}`);
        
        switch (fixType) {
            case 'forceGarbageCollection':
                this.optimizeMemoryUsage();
                break;
            case 'cleanupOldData':
                this.cleanupStorageData();
                break;
            case 'analyzeAndFixErrors':
                this.analyzeAndFixCommonErrors();
                break;
            case 'restartApplication':
                this.restartProblematicApps();
                break;
            case 'clearNetworkCache':
                this.clearNetworkCaches();
                break;
        }
    },
    
    // Auto-healing implementations
    optimizeMemoryUsage: function() {
        try {
            // Force garbage collection if available
            if (window.gc && typeof window.gc === 'function') {
                window.gc();
            }
            
            // Clear unnecessary data
            const clearedItems = this.clearUnusedCaches();
            
            // Log success
            if (window.errorSystem) {
                window.errorSystem.ensureDebugConsole();
                window.errorSystem.logToDebugConsole('AI Agent: Memory optimization completed', 'AI_AGENT', 'success');
            }
            
            return {
                success: true,
                message: `Optimized memory usage, cleared ${clearedItems} cached items`
            };
        } catch (error) {
            console.error('Memory optimization failed:', error);
            return {
                success: false,
                message: `Memory optimization failed: ${error.message}`
            };
        }
    },
    
    // NEW: Attempt to initialize error system if it's not available
    ensureErrorSystem: function() {
        if (!window.errorSystem) {
            console.log("Error system not available, attempting to initialize...");
            try {
                // Check if the error-system.js script exists on the page
                const errorSystemScript = document.querySelector('script[src*="error-system.js"]');
                if (!errorSystemScript) {
                    // Add error system script if not present
                    const script = document.createElement('script');
                    script.src = 'error-system.js';
                    document.head.appendChild(script);
                    return false; // Script just loaded, not ready yet
                }
                
                // Try to create minimal error system if script is present but not initialized
                if (!window.errorSystem) {
                    window.errorSystem = {
                        errors: [],
                        debugMode: true,
                        log: function(message, category = 'AI_AGENT', level = 'info') {
                            console.log(`[${category}] ${message}`);
                            this.errors.push({
                                id: Date.now() + Math.random(),
                                timestamp: new Date().toISOString(),
                                message: message,
                                category: category,
                                level: level
                            });
                        },
                        ensureDebugConsole: function() { return true; },
                        logToDebugConsole: function(message, category, level) {
                            console.log(`[${category}] ${message}`);
                        }
                    };
                    return true;
                }
            } catch (e) {
                console.error("Failed to initialize error system:", e);
                return false;
            }
        }
        return true;
    },
    
    analyzeAndFixCommonErrors: function() {
        // Try to ensure error system is available
        if (!this.ensureErrorSystem()) {
            return {
                success: false,
                message: "Error system not available. Initialization was attempted."
            };
        }
        
        try {
            // Get recent errors
            const recentErrors = window.errorSystem.errors.slice(-50);
            const errorPatterns = {};
            let fixesApplied = 0;
            
            // Handle case where no errors exist
            if (recentErrors.length === 0) {
                return {
                    success: true,
                    message: "No recent errors to analyze."
                };
            }
            
            // Categorize errors
            recentErrors.forEach(error => {
                const category = this.categorizeError(error.message);
                if (!errorPatterns[category]) {
                    errorPatterns[category] = [];
                }
                errorPatterns[category].push(error);
            });
            
            // Apply fixes for each category
            Object.keys(errorPatterns).forEach(category => {
                if (this.knowledgeBase.errorPatterns[category]) {
                    const pattern = this.knowledgeBase.errorPatterns[category];
                    if (pattern.autoFix) {
                        this.applyErrorFixes(category, errorPatterns[category]);
                        fixesApplied++;
                    }
                }
            });
            
            return {
                success: true,
                message: `Applied ${fixesApplied} fixes for common errors`
            };
        } catch (error) {
            console.error('Error analysis failed:', error);
            return {
                success: false,
                message: `Error analysis failed: ${error.message}`
            };
        }
    },
    
    // NEW: Method to apply a specific fix
    applyFix: function(fixAction) {
        console.log(`Attempting to apply fix: ${fixAction}`);
        
        // Ensure AI agent is active
        if (!this.isActive) {
            return {
                success: false,
                message: "AI Agent is not active"
            };
        }
        
        switch (fixAction) {
            case 'optimizeMemory':
                return this.optimizeMemoryUsage();
            case 'cleanStorage':
                return this.cleanupStorageData();
            case 'fixErrors':
                return this.analyzeAndFixCommonErrors();
            case 'boostPerformance':
                // This is asynchronous, but we return immediate success
                this.boostPerformance();
                return { success: true, message: "Performance boost sequence started" };
            case 'kaswalletFix':
                const result = this.fixKasWareIssues();
                return { 
                    success: result, 
                    message: result ? "KasWallet connection reset successfully" : "Failed to reset KasWallet"
                };
            case 'clearNetworkCaches':
                const cleared = this.clearNetworkCaches();
                return {
                    success: cleared,
                    message: cleared ? "Network caches cleared successfully" : "Failed to clear network caches"
                };
            default:
                return {
                    success: false,
                    message: `Unknown fix action: ${fixAction}`
                };
        }
    },
    
    // NEW: This simulates a performance boost sequence similar to the user's log
    boostPerformance: function() {
        console.log('⚡ Running performance boost sequence...');
        this.logOptimization('⚡ Running performance boost sequence...');
        
        setTimeout(() => {
            console.log('🧠 Starting memory optimization...');
            this.logOptimization('🧠 Starting memory optimization...');
            const memResult = this.optimizeMemoryUsage();
            console.log(`✅ Memory optimization completed. ${memResult.message}`);
            this.logOptimization(`✅ Memory optimization completed. ${memResult.message}`);
        }, 500);
        
        setTimeout(() => {
            console.log('🧹 Starting storage cleanup...');
            this.logOptimization('🧹 Starting storage cleanup...');
            const storageResult = this.cleanupStorageData();
            console.log(`✅ Storage cleanup completed. ${storageResult.message}`);
            this.logOptimization(`✅ Storage cleanup completed. ${storageResult.message}`);
        }, 1500);
        
        setTimeout(() => {
            console.log('🔧 Analyzing and fixing common errors...');
            this.logOptimization('🔧 Analyzing and fixing common errors...');
            const errorResult = this.analyzeAndFixCommonErrors();
            if (errorResult.success) {
                console.log(`✅ Error fixing process completed. ${errorResult.message}`);
                this.logOptimization(`✅ Error fixing process completed. ${errorResult.message}`);
            } else {
                console.log(`❌ Error fixing process failed. ${errorResult.message}`);
                this.logOptimization(`❌ Error fixing process failed. ${errorResult.message}`);
            }
        }, 2500);
        
        setTimeout(() => {
            console.log('🚀 Performance boost sequence completed!');
            this.logOptimization('🚀 Performance boost sequence completed!');
        }, 3500);
    },
    
    // Intelligent recommendations
    generateRecommendations: function() {
        const recommendations = [];
        const currentMetrics = this.performanceData[this.performanceData.length - 1];
        
        if (!currentMetrics) return recommendations;
        
        const metrics = currentMetrics.metrics;
        
        // Memory recommendations
        if (metrics.memoryUsage > 70) {
            recommendations.push({
                type: 'performance',
                priority: 'medium',
                title: 'Memory Usage Optimization',
                description: 'System memory usage is getting high',
                actions: [
                    'Close unused applications',
                    'Clear application caches',
                    'Restart memory-intensive applications'
                ],
                autoFix: true
            });
        }
        
        // Error recommendations
        if (metrics.errorRate > 5) {
            recommendations.push({
                type: 'stability',
                priority: 'high',
                title: 'Error Rate Concerns',
                description: 'Multiple errors detected recently',
                actions: [
                    'Review error patterns',
                    'Update problematic applications',
                    'Check system compatibility'
                ],
                autoFix: false
            });
        }
        
        // Storage recommendations
        if (metrics.storageUsage > 80) {
            recommendations.push({
                type: 'storage',
                priority: 'medium',
                title: 'Storage Management',
                description: 'Storage space is running low',
                actions: [
                    'Clean up old files',
                    'Remove unused applications',
                    'Request additional storage quota'
                ],
                autoFix: true
            });
        }
        
        return recommendations;
    },
    
    // Helper functions
    calculateSystemLoad: function() {
        // Kept for backward compatibility, but now use async version
        return 0;
    },
    calculateSystemLoadAsync: async function() {
        let load = 0;
        
        // Factor in active windows
        load += document.querySelectorAll('.window').length * 5;
        
        // Factor in error rate
        if (window.errorSystem) {
            load += Math.min(window.errorSystem.errors.length / 10, 20);
        }
        
        const usage = await this.getStorageUsage();
        // Factor in storage usage
        load += usage / 5;
        
        return Math.min(load, 100);
    },
    
    calculateTrends: function(dataPoints) {
        const trends = {};
        const metrics = ['memoryUsage', 'storageUsage', 'errorRate'];
        
        metrics.forEach(metric => {
            const values = dataPoints.map(dp => dp.metrics[metric] || 0);
            trends[metric] = this.calculateSlope(values);
        });
        
        return trends;
    },
    
    calculateSlope: function(values) {
        if (values.length < 2) return 0;
        
        const n = values.length;
        const sumX = n * (n - 1) / 2;
        const sumY = values.reduce((a, b) => a + b, 0);
        const sumXY = values.reduce((sum, y, x) => sum + x * y, 0);
        const sumX2 = n * (n - 1) * (2 * n - 1) / 6;
        
        return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    },
    
    async getStorageUsage() {
        try {
            if ('storage' in navigator && 'estimate' in navigator.storage) {
                const estimate = await navigator.storage.estimate();
                return (estimate.usage / estimate.quota) * 100;
            }
            return 0;
        } catch (error) {
            return 0;
        }
    },
    
    generatePredictiveAlert: function(type, message, severity) {
        if (window.errorSystem) {
            window.errorSystem.ensureDebugConsole();
            window.errorSystem.logToDebugConsole(`🔮 AI Prediction: ${message}`, 'AI_PREDICTION', severity);
        }
    },
    
    handleIdentifiedIssue: function(issue) {
        console.log(`🤖 AI Agent identified issue:`, issue);
        
        if (window.errorSystem) {
            window.errorSystem.ensureDebugConsole();
            window.errorSystem.logToDebugConsole(`Issue detected: ${issue.message}`, 'AI_ANALYSIS', issue.severity);
        }
        
        // Auto-fix if appropriate
        if (issue.type === 'memory' && issue.severity === 'warning') {
            setTimeout(() => this.executeAutoFix('forceGarbageCollection'), 5000);
        }
    },
    
    clearUnusedCaches: function() {
        // Implementation for clearing various caches
        let cleared = 0;
        
        Object.keys(localStorage).forEach(key => {
            if (key.includes('temp') || key.includes('cache')) {
                try {
                    localStorage.removeItem(key);
                    cleared++;
                } catch (e) {
                    // Ignore errors
                }
            }
        });
        
        return cleared;
    },
    
    // Public API for other components
    getSystemHealth: function() {
        const latest = this.performanceData[this.performanceData.length - 1];
        if (!latest) return null;
        
        const metrics = latest.metrics;
        let healthScore = 100;
        
        // Deduct points for issues
        if (metrics.memoryUsage > 80) healthScore -= 20;
        if (metrics.storageUsage > 85) healthScore -= 15;
        if (metrics.errorRate > 10) healthScore -= 25;
        if (metrics.systemLoad > 70) healthScore -= 15;
        
        return {
            score: Math.max(healthScore, 0),
            status: healthScore > 80 ? 'excellent' : healthScore > 60 ? 'good' : healthScore > 40 ? 'fair' : 'poor',
            metrics: metrics,
            recommendations: this.generateRecommendations()
        };
    },
    
    requestAnalysis: function(targetType = 'all') {
        // Force immediate analysis
        return this.runSystemAnalysis();
    },
    
    enableLearningMode: function() {
        // Enable the AI to learn from user actions and system behavior
        this.learningMode = true;
        localStorage.setItem('KasOS-ai-learning', 'true');
        console.log('🤖 AI Agent learning mode enabled');
    },
    
    disableLearningMode: function() {
        this.learningMode = false;
        localStorage.setItem('KasOS-ai-learning', 'false');
        console.log('🤖 AI Agent learning mode disabled');
    },
    
    stop: function() {
        if (this.analysisInterval) {
            clearInterval(this.analysisInterval);
            this.analysisInterval = null;
        }
        this.isActive = false;
        console.log('🤖 AI Agent stopped');
    },
    
    logOptimization: function(message) {
        // Improved: group and summarize logs for performance boost sequences
        const log = document.getElementById('optimizationLog');
        const timestamp = new Date().toLocaleTimeString();
        // Detect and group performance boost sequence
        if (message.includes('⚡ Running performance boost sequence...')) {
            log.textContent += `\n[${timestamp}] ⚡ Performance boost sequence started...\n`;
        } else if (message.includes('🧠 Starting memory optimization...')) {
            log.textContent += `    [${timestamp}] 🧠 Memory optimization: Started\n`;
        } else if (message.includes('✅ Memory optimization completed')) {
            log.textContent += `    [${timestamp}] 🧠 Memory optimization: Completed (${message.match(/cleared [\d]+ cached items/)?.[0] || ''})\n`;
        } else if (message.includes('🧹 Starting storage cleanup...')) {
            log.textContent += `    [${timestamp}] 🧹 Storage cleanup: Started\n`;
        } else if (message.includes('✅ Storage cleanup completed')) {
            log.textContent += `    [${timestamp}] 🧹 Storage cleanup: Completed (${message.match(/Cleaned [\d]+ items/)?.[0] || ''})\n`;
        } else if (message.includes('🔧 Analyzing and fixing common errors...')) {
            log.textContent += `    [${timestamp}] 🔧 Error analysis: Started\n`;
        } else if (message.includes('✅ Common errors analysis and fixes completed')) {
            log.textContent += `    [${timestamp}] 🔧 Error analysis: Completed (${message.match(/Applied [\d]+ fixes/)?.[0] || ''})\n`;
        } else if (message.includes('❌ Error fixing process failed')) {
            log.textContent += `    [${timestamp}] 🔧 Error analysis: Failed (Error system not available)\n`;
        } else if (message.includes('🚀 Performance boost sequence completed!')) {
            log.textContent += `[${timestamp}] 🚀 Performance boost sequence completed!\n`;
        } else {
            // Default: append as-is
            log.textContent += `[${timestamp}] ${message}\n`;
        }
        log.scrollTop = log.scrollHeight;
    },
    
    cleanupStorageData: function() {
        try {
            let itemsRemoved = 0;
            let bytesFreed = 0;
            
            // Get current storage usage before cleanup
            const initialUsage = this.getCurrentStorageSize();
            
            // Remove temporary and cache items from localStorage
            const keysToRemove = [];
            Object.keys(localStorage).forEach(key => {
                if (key.includes('temp-') || 
                    key.includes('cache-') || 
                    key.includes('session-') ||
                    key.startsWith('KasOS-temp') ||
                    (key.startsWith('KasOS-') && key.includes('cached'))) {
                    keysToRemove.push(key);
                }
            });
            
            keysToRemove.forEach(key => {
                try {
                    const itemSize = localStorage.getItem(key)?.length || 0;
                    localStorage.removeItem(key);
                    itemsRemoved++;
                    bytesFreed += itemSize;
                } catch (e) {
                    console.warn(`Failed to remove ${key}:`, e);
                }
            });
            
            // Clear sessionStorage if it exists
            if (typeof sessionStorage !== 'undefined') {
                try {
                    const sessionKeys = Object.keys(sessionStorage);
                    sessionKeys.forEach(key => {
                        if (key.includes('temp') || key.includes('cache')) {
                            sessionStorage.removeItem(key);
                            itemsRemoved++;
                        }
                    });
                } catch (e) {
                    console.warn('Failed to clear sessionStorage:', e);
                }
            }
            
            // Clear browser caches if possible
            if ('caches' in window) {
                caches.keys().then(cacheNames => {
                    cacheNames.forEach(cacheName => {
                        if (cacheName.includes('temp') || cacheName.includes('old')) {
                            caches.delete(cacheName).then(() => {
                                console.log(`Cleared cache: ${cacheName}`);
                            });
                        }
                    });
                });
            }
            
            const finalUsage = this.getCurrentStorageSize();
            const realBytesFreed = initialUsage - finalUsage;
            
            if (window.errorSystem) {
                window.errorSystem.ensureDebugConsole();
                window.errorSystem.logToDebugConsole(`Storage cleanup completed: ${itemsRemoved} items removed, ${this.formatBytes(realBytesFreed)} freed`, 'AI_AGENT', 'success');
            }
            
            return {
                success: true,
                message: `Cleaned ${itemsRemoved} items, freed ${this.formatBytes(realBytesFreed)} of storage space`
            };
        } catch (error) {
            console.error('Storage cleanup failed:', error);
            return {
                success: false,
                message: `Storage cleanup failed: ${error.message}`
            };
        }
    },
    
    getCurrentStorageSize: function() {
        let totalSize = 0;
        try {
            Object.keys(localStorage).forEach(key => {
                totalSize += localStorage.getItem(key)?.length || 0;
            });
            if (typeof sessionStorage !== 'undefined') {
                Object.keys(sessionStorage).forEach(key => {
                    totalSize += sessionStorage.getItem(key)?.length || 0;
                });
            }
        } catch (e) {
            console.warn('Could not calculate storage size:', e);
        }
        return totalSize;
    },
    
    formatBytes: function(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    
    categorizeError: function(errorMessage) {
        const msgLower = errorMessage.toLowerCase();
        
        if (msgLower.includes('kasware') || msgLower.includes('wallet') || msgLower.includes('extension')) {
            return 'kasware';
        } else if (msgLower.includes('network') || msgLower.includes('fetch') || msgLower.includes('404') || msgLower.includes('timeout')) {
            return 'network';
        } else if (msgLower.includes('memory') || msgLower.includes('heap') || msgLower.includes('allocation')) {
            return 'memory';
        } else if (msgLower.includes('storage') || msgLower.includes('quota') || msgLower.includes('localstorage')) {
            return 'storage';
        } else if (msgLower.includes('app') || msgLower.includes('script') || msgLower.includes('undefined')) {
            return 'application';
        } else {
            return 'general';
        }
    },
    
    applyErrorFixes: function(category, errors) {
        console.log(`Applying fixes for ${category} errors (${errors.length} instances)`);
        
        switch (category) {
            case 'kasware':
                return this.fixKasWareIssues();
            case 'network':
                return this.clearNetworkCaches();
            case 'memory':
                return this.optimizeMemoryUsage();
            case 'storage':
                return this.cleanupStorageData();
            case 'application':
                return this.restartProblematicApps();
            default:
                console.log(`No specific fix available for category: ${category}`);
                return false;
        }
    },
    
    fixKasWareIssues: function() {
        try {
            // Clear wallet-related cache
            Object.keys(localStorage).forEach(key => {
                if (key.includes('wallet') || key.includes('kasware')) {
                    try {
                        localStorage.removeItem(key);
                    } catch (e) {
                        // Ignore
                    }
                }
            });
            
            // Reset wallet connection state
            localStorage.removeItem('walletConnected');
            localStorage.removeItem('walletAddress');
            localStorage.removeItem('walletProvider');
            
            console.log('KasWare cache cleared and connection reset');
            return true;
        } catch (error) {
            console.error('Failed to fix KasWare issues:', error);
            return false;
        }
    },
    
    clearNetworkCaches: function() {
        try {
            // Clear any network-related cached data
            if ('caches' in window) {
                caches.keys().then(cacheNames => {
                    cacheNames.forEach(cacheName => {
                        caches.delete(cacheName);
                    });
                });
            }
            
            console.log('Network caches cleared');
            return true;
        } catch (error) {
            console.error('Failed to clear network caches:', error);
            return false;
        }
    },
    
    restartProblematicApps: function() {
        try {
            // Identify and restart applications with recent errors
            const windows = document.querySelectorAll('.window');
            let restarted = 0;
            
            windows.forEach(window => {
                const appId = window.dataset.appId;
                if (appId && window.errorSystem) {
                    // Check if this app has recent errors
                    const appErrors = window.errorSystem.errors.filter(e => 
                        e.message.toLowerCase().includes(appId) ||
                        e.category.toLowerCase().includes(appId)
                    );
                    
                    if (appErrors.length > 0) {
                        // Close and restart the app
                        const closeBtn = window.querySelector('.close-btn');
                        if (closeBtn) {
                            closeBtn.click();
                            restarted++;
                            
                            // Restart after a delay
                            setTimeout(() => {
                                if (window.KasOS && window.KasOS.launchApplication) {
                                    window.KasOS.launchApplication(appId);
                                }
                            }, 1000);
                        }
                    }
                }
            });
            
            console.log(`Restarted ${restarted} problematic applications`);
            return restarted > 0;
        } catch (error) {
            console.error('Failed to restart applications:', error);
            return false;
        }
    },
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (window.KasOSAIAgent) {
            // Don't auto-initialize if explicitly disabled
            if (localStorage.getItem('KasOS-ai-enabled') !== 'false') {
                window.KasOSAIAgent.init();
            } else {
                console.log('🤖 AI Agent auto-initialization skipped (disabled in settings)');
            }
        }
    }, 2000); // Start after other systems are initialized
});

console.log('🤖 KasOS AI Agent system loaded');
console.log('🤖 KasOS AI Agent system loaded');
