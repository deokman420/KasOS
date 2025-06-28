/**
 * KasOS Global Object
 * Initializing the global KasOS object that provides core functionality to applications
 */
 
window.KasOS = {
    // User management
    getUsers: function() {
        const users = JSON.parse(localStorage.getItem('KasOS-users') || '{}');
        return users;
    },
    
    // Window management
    createWindow: function(title, content, width = 600, height = 400) {
        // This function will be fully implemented in the window management section
        const windowElement = document.querySelector('.window-template').cloneNode(true).querySelector('.window');
        windowElement.querySelector('.window-title').textContent = title;
        windowElement.querySelector('.window-content').innerHTML = content;
        
        document.body.appendChild(windowElement);
        return windowElement;
    },
    
    // Notification system
    showNotification: function(message, type = 'info') {
        if (window.errorSystem) {
            window.errorSystem.log(message, 'UI', type);
        } else {
            console.log(`[Notification] ${message}`);
        }
    },
    
    // User action tracking for error reporting
    userActionLog: [],
    // Add focusWindow implementation
    focusWindow: function(windowId) {
        // Find the window element by data-window-id
        const win = document.querySelector(`.window[data-window-id="${windowId}"]`);
        if (win) {
            // Bring to front by increasing z-index (simple implementation)
            // Find current max z-index
            let maxZ = 1000;
            document.querySelectorAll('.window').forEach(w => {
                const z = parseInt(w.style.zIndex) || 1000;
                if (z > maxZ) maxZ = z;
            });
            win.style.zIndex = maxZ + 1;
            // Optionally, trigger focus event if needed
            win.classList.add('focused');
            // Remove focus from others
            document.querySelectorAll('.window').forEach(w => {
                if (w !== win) w.classList.remove('focused');
            });
        }
    }
};

// Initialize the global KasOS object
window.KasOS = window.KasOS || {};

// KasOS - Clean Implementation with Fixed Login/Registration

// DOM Safety Utility
window.safeDOM = {
    get: function(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element with id '${id}' not found`);
        }
        return element;
    },
    setText: function(id, text) {
        const element = this.get(id);
        if (element) {
            element.textContent = text;
        }
    },
    setHTML: function(id, html) {
        const element = this.get(id);
        if (element) {
            element.innerHTML = html;
        }
    },
    getValue: function(id) {
        const element = this.get(id);
        return element ? element.value : '';
    },
    setValue: function(id, value) {
        const element = this.get(id);
        if (element) {
            element.value = value;
        }
    },
    setStyle: function(id, property, value) {
        const element = this.get(id);
        if (element && element.style) {
            element.style[property] = value;
        }
    }
};

// Add comprehensive DOM safety wrapper
window.safeElement = function(id) {
    const element = document.getElementById(id);
    return {
        exists: !!element,
        element: element,
        setText: function(text) {
            if (element && element.textContent !== undefined) {
                element.textContent = text;
            }
        },
        setHTML: function(html) {
            if (element && element.innerHTML !== undefined) {
                element.innerHTML = html;
            }
        },
        getValue: function() {
            return (element && element.value !== undefined) ? element.value : '';
        },
        setValue: function(value) {
            if (element && element.value !== undefined) {
                element.value = value;
            }
        },
        setStyle: function(property, value) {
            if (element && element.style && typeof element.style[property] !== 'undefined') {
                try {
                    element.style[property] = value;
                } catch (e) {
                    console.warn(`Failed to set style ${property} on element ${id}:`, e);
                }
            }
        },
        hide: function() {
            this.setStyle('display', 'none');
        },
        show: function() {
            this.setStyle('display', 'block');
        },
        addEventListener: function(event, handler) {
            if (element && typeof element.addEventListener === 'function') {
                element.addEventListener(event, function(e) {
                    try {
                        return handler(e);
                    } catch (error) {
                        console.warn(`Event handler error on ${id}:`, error);
                        return false;
                    }
                });
            }
        }
    };
};

class KasOS {
    constructor() {
        this.currentUser = null;
        this.windows = [];
        this.currentDesktop = 1;
        this.zIndex = 100;
        this.applications = {};
        this.db = null;
        
        this.init();
    }    init() {
        try {
            this.initializeIndexedDB();
            this.initializeEnhancedStorage();
            this.setupEventListeners();
            this.updateClock();
            this.checkAutoLogin();
        } catch (error) {
            console.error('KasOS initialization failed:', error);
        }
    }
    
    async initializeEnhancedStorage() {
        this.storageManager = new EnhancedStorageManager();
        
        // Request persistent storage to prevent eviction
        if ('storage' in navigator && 'persist' in navigator.storage) {
            const persistent = await navigator.storage.persist();
            if (persistent) {
                console.log('✅ Persistent storage granted - 500MB-2GB capacity available');
            } else {
                console.log('⚠️ Persistent storage denied - using standard quotas');
            }
        }
        
        // Show storage capacity to user
        const usage = await this.storageManager.getStorageUsage();
        if (usage.quota) {
            const capacityMB = Math.round(usage.quota / (1024 * 1024));
            console.log(`📊 Storage capacity: ${capacityMB}MB available`);
            
            if (capacityMB >= 25) {
                this.showNotification(`Storage capacity: ${capacityMB}MB available`, 'success', 3000);
            }
        }
    }
      setupEventListeners() {
        // Login and Registration handlers
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const passwordInput = document.getElementById('password');
        const logoutBtn = document.getElementById('logoutBtn');
        const walletLoginBtn = document.getElementById('walletLoginBtn');
        
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.login());
        }
        
        if (registerBtn) {
            registerBtn.addEventListener('click', () => this.register());
        }
        
        if (passwordInput) {
            passwordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.login();
                }
            });
        }
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }        // Wallet Login handler
        if (walletLoginBtn) {
            walletLoginBtn.addEventListener('click', () => {
                // Check if wallet login function is available in the global KasOS instance
                if (typeof window.KasOS.walletLogin === 'function') {
                    window.KasOS.walletLogin();
                } else {
                    console.error('Wallet login not available');
                }
            });
        }
        
        // Desktop icon handlers
        document.querySelectorAll('.desktop-icon').forEach(icon => {
            icon.addEventListener('dblclick', (e) => {
                const app = e.currentTarget.dataset.app;
                this.launchApplication(app);
            });
        });
        
        // Start menu handlers
        const startButton = document.getElementById('startButton');
        if (startButton) {
            startButton.addEventListener('click', () => this.toggleStartMenu());
        }
        
        document.querySelectorAll('.start-app').forEach(app => {
            app.addEventListener('click', (e) => {
                const appName = e.currentTarget.dataset.app;
                this.launchApplication(appName);
            });
        });
    }    async login() {
        this.cleanupStorageBeforeLogin();
        
        const username = safeElement('username').getValue();
        const password = safeElement('password').getValue();
        const errorDiv = safeElement('loginError');
        
        if (!username || !password) {
            errorDiv.setText('Please enter both username and password');
            return;
        }
        
        try {
            const hashedPassword = await this.hashPassword(password);
            const user = await this.getUser(username);
            
            if (!user) {
                errorDiv.setText('User not found. Please register first.');
                return;
            }
            
            if (user.password !== hashedPassword) {
                errorDiv.setText('Invalid password');
                return;
            }
            
            // Store minimal user data with smart storage management
            const userData = {
                username: user.username,
                loginTime: new Date().toISOString()
            };
            
            // Use enhanced storage method
            await this.smartStorageSave('KasOS-current-user', userData, true);
            this.currentUser = user;
            this.showDesktop();
            
        } catch (error) {
            if (error.name === 'QuotaExceededError' || error.message.includes('quota')) {
                errorDiv.setText('Storage full. Attempting cleanup...');
                setTimeout(async () => {
                    try {
                        await this.handleStorageQuotaError();
                        errorDiv.setText('Storage cleaned. Please try logging in again.');
                    } catch (e) {
                        errorDiv.setText('Storage quota exceeded. Please clear browser data.');
                        this.showAdvancedStorageDialog();
                    }
                }, 1000);
            } else {
                errorDiv.setText('Login failed. Please try again.');
                console.error('Login error:', error);
            }
        }
    }
      async register() {
        this.cleanupStorageBeforeLogin();
        
        const username = safeElement('username').getValue();
        const password = safeElement('password').getValue();
        const errorDiv = safeElement('loginError');
        
        if (!username || !password) {
            errorDiv.setText('Please enter both username and password');
            return;
        }
        
        if (username.length < 3) {
            errorDiv.setText('Username must be at least 3 characters');
            return;
        }
        
        if (password.length < 4) {
            errorDiv.setText('Password must be at least 4 characters');
            return;
        }
        
        try {
            const existingUser = await this.getUser(username);
            if (existingUser) {
                errorDiv.setText('Username already exists');
                return;
            }
            
            const hashedPassword = await this.hashPassword(password);
            const user = {
                username: username,
                password: hashedPassword,
                created: new Date().toISOString()
            };
            
            // Save user with enhanced storage management
            await this.saveUser(user);
            
            // Store minimal user data
            const userData = {
                username: user.username,
                loginTime: new Date().toISOString()
            };
            
            await this.smartStorageSave('KasOS-current-user', userData, true);
            this.currentUser = user;
            this.showDesktop();
            
        } catch (error) {
            if (error.name === 'QuotaExceededError' || error.message.includes('quota')) {
                errorDiv.setText('Storage full. Attempting cleanup...');
                setTimeout(async () => {
                    try {
                        await this.handleStorageQuotaError();
                        errorDiv.setText('Storage cleaned. Please try registering again.');
                    } catch (e) {
                        errorDiv.setText('Storage quota exceeded. Please clear browser data.');
                        this.showAdvancedStorageDialog();
                    }
                }, 1000);
            } else {
                errorDiv.setText('Registration failed. Please try again.');
                console.error('Registration error:', error);
            }
        }
    }
    
    // Smart storage management system
    async smartStorageSave(key, data, critical = false) {
        try {
            // First attempt: Direct save
            return await this.saveToStorage(key, data, critical);
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                console.log('Storage quota exceeded, trying smart recovery...');
                
                // Second attempt: Clean and retry
                await this.handleStorageQuotaError();
                try {
                    return await this.saveToStorage(key, data, critical);
                } catch (secondError) {
                    if (critical) {
                        // Third attempt: Use IndexedDB as fallback
                        console.log('Falling back to IndexedDB for critical data...');
                        return await this.saveToIndexedDB(key, data);
                    }
                    throw secondError;
                }
            }
            throw error;
        }
    }
    
    async handleStorageQuotaError() {
        console.log('Handling storage quota error with advanced cleanup...');
        
        // Step 1: Aggressive localStorage cleanup
        await this.performAdvancedCleanup();
        
        // Step 2: Move large data to IndexedDB
        await this.migrateToIndexedDB();
        
        // Step 3: Compress remaining data
        await this.advancedCompression();
        
        console.log('Advanced storage cleanup completed');
    }
    
    async performAdvancedCleanup() {
        try {
            // Clear ALL non-essential localStorage data
            const preserveKeys = [
                'KasOS-current-user',
                'KasOS-users',
                'KasOS-settings'
            ];
            
            const toRemove = [];
            Object.keys(localStorage).forEach(key => {
                if (!preserveKeys.includes(key)) {
                    toRemove.push(key);
                }
            });
            
            // Remove in batches to avoid blocking
            for (let i = 0; i < toRemove.length; i += 10) {
                const batch = toRemove.slice(i, i + 10);
                batch.forEach(key => {
                    try {
                        localStorage.removeItem(key);
                    } catch (e) {
                        // Ignore errors
                    }
                });
                
                // Allow other operations between batches
                await new Promise(resolve => setTimeout(resolve, 10));
            }
            
            console.log(`Removed ${toRemove.length} localStorage items`);
            
        } catch (e) {
            console.error('Advanced cleanup failed:', e);
        }
    }
    
    async migrateToIndexedDB() {
        try {
            // Move user files and large data to IndexedDB
            const filesToMigrate = [];
            
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('KasOS-files-') || 
                    key.startsWith('KasOS-notes') ||
                    (localStorage[key].length > 5000)) {
                    filesToMigrate.push(key);
                }
            });
            
            for (const key of filesToMigrate) {
                try {
                    const data = localStorage.getItem(key);
                    await this.saveToIndexedDB(key, JSON.parse(data));
                    localStorage.removeItem(key);
                    console.log(`Migrated ${key} to IndexedDB`);
                } catch (e) {
                    console.warn(`Failed to migrate ${key}:`, e);
                }
            }
            
        } catch (e) {
            console.error('Migration to IndexedDB failed:', e);
        }
    }
    
    async saveToIndexedDB(key, data) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('IndexedDB not available'));
                return;
            }
            
            try {
                const transaction = this.db.transaction(['storage'], 'readwrite');
                const store = transaction.objectStore('storage');
                const request = store.put({ key: key, data: data, timestamp: Date.now() });
                
                request.onsuccess = () => resolve(true);
                request.onerror = () => reject(request.error);
            } catch (e) {
                reject(e);
            }
        });
    }
    
    async getFromIndexedDB(key) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('IndexedDB not available'));
                return;
            }
            
            try {
                const transaction = this.db.transaction(['storage'], 'readonly');
                const store = transaction.objectStore('storage');
                const request = store.get(key);
                
                request.onsuccess = () => {
                    if (request.result) {
                        resolve(request.result.data);
                    } else {
                        resolve(null);
                    }
                };
                request.onerror = () => reject(request.error);
            } catch (e) {
                reject(e);
            }
        });
    }
    
    async advancedCompression() {
        try {
            // Advanced compression for remaining localStorage data
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('KasOS-')) {
                    try {
                        const data = localStorage.getItem(key);
                        if (data.length > 100) {
                            // Advanced JSON compression
                            const parsed = JSON.parse(data);
                            const compressed = this.compressJSON(parsed);
                            const compressedString = JSON.stringify(compressed);
                            
                            if (compressedString.length < data.length) {
                                localStorage.setItem(key, compressedString);
                                console.log(`Compressed ${key}: ${data.length} -> ${compressedString.length} bytes`);
                            }
                        }
                    } catch (e) {
                        // Data might not be JSON
                    }
                }
            });
            
        } catch (e) {
            console.error('Advanced compression failed:', e);
        }
    }
    
    compressJSON(obj) {
        // Simple JSON compression by removing redundant data
        if (Array.isArray(obj)) {
            return obj.map(item => this.compressJSON(item));
        } else if (obj && typeof obj === 'object') {
            const compressed = {};
            Object.keys(obj).forEach(key => {
                const value = obj[key];
                // Skip null, undefined, empty strings, empty arrays
                if (value !== null && value !== undefined && value !== '' && 
                    !(Array.isArray(value) && value.length === 0)) {
                    compressed[key] = this.compressJSON(value);
                }
            });
            return compressed;
        }
        return obj;
    }
    
    showAdvancedStorageDialog() {
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.9);
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-family: Arial, sans-serif;
        `;
        
        const usage = this.getStorageUsage();
        const usageDetails = Object.entries(usage.details)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([key, size]) => `<div>${key}: ${Math.round(size/1024)}KB</div>`)
            .join('');
        
        dialog.innerHTML = `
            <div style="background: #dc3545; padding: 30px; border-radius: 8px; max-width: 600px; text-align: center;">
                <h2>🚨 Storage Quota Exceeded</h2>
                <p>Your browser's storage is completely full (${Math.round(usage.totalSize/1024)}KB used).</p>
                
                <div style="margin: 20px 0; text-align: left; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 4px;">
                    <h4>Largest Items:</h4>
                    ${usageDetails}
                </div>
                
                <p style="margin: 20px 0;">Choose an option to continue:</p>
                  <div style="margin: 20px 0;">
                    <button onclick="this.closest('div[style*=\"position: fixed\"]').remove(); window.KasOS.emergencyCleanup()" 
                            style="background: #ffc107; color: black; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin: 5px;">
                        🧹 Emergency Cleanup
                    </button>
                    <button onclick="this.closest('div[style*=\"position: fixed\"]').remove(); window.KasOS.clearAllData()" 
                            style="background: white; color: #dc3545; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin: 5px;">
                        🗑️ Clear All Data
                    </button>
                    <button onclick="this.closest('div[style*=\"position: fixed\"]').remove(); window.KasOS.switchToIncognito()" 
                            style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin: 5px;">
                        🕵️ Use Incognito Mode
                    </button>
                </div>
                
                <div style="margin-top: 20px;">
                    <button onclick="this.closest('div[style*=\"position: fixed\"]').remove()" 
                            style="background: #28a745; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                        Cancel
                    </button>
                </div>
                
                <p style="font-size: 12px; opacity: 0.8; margin-top: 15px;">
                    💡 Tip: Use Chrome's Incognito mode or Firefox's Private browsing for unlimited storage.
                </p>
            </div>
        `;
        
        document.body.appendChild(dialog);
    }
    
    async emergencyCleanup() {
        try {
            const confirmMsg = 'Emergency cleanup will remove all KasOS data except user accounts. Continue?';
            if (confirm(confirmMsg)) {
                console.log('Starting emergency cleanup...');
                
                // Keep only absolutely essential data
                const criticalKeys = ['KasOS-users'];
                const backup = {};
                
                // Backup critical data
                criticalKeys.forEach(key => {
                    const data = localStorage.getItem(key);
                    if (data) {
                        backup[key] = data;
                    }
                });
                
                // Clear everything
                localStorage.clear();
                
                // Restore critical data
                Object.entries(backup).forEach(([key, data]) => {
                    try {
                        localStorage.setItem(key, data);
                    } catch (e) {
                        console.error(`Failed to restore ${key}:`, e);
                    }
                });
                
                // Clear IndexedDB
                if (this.db) {
                    const stores = ['files', 'storage'];
                    for (const storeName of stores) {
                        try {
                            const transaction = this.db.transaction([storeName], 'readwrite');
                            const store = transaction.objectStore(storeName);
                            await new Promise((resolve, reject) => {
                                const request = store.clear();
                                request.onsuccess = () => resolve();
                                request.onerror = () => reject(request.error);
                            });
                        } catch (e) {
                            console.warn(`Failed to clear ${storeName}:`, e);
                        }
                    }
                }
                
                alert('Emergency cleanup completed! Please refresh the page.');
                location.reload();
            }
        } catch (e) {
            alert('Emergency cleanup failed. Please manually clear browser storage.');
            console.error('Emergency cleanup error:', e);
        }
    }
    
    switchToIncognito() {
        const message = `
            To use KasOS with unlimited storage:
            
            Chrome: Ctrl+Shift+N (Windows) or Cmd+Shift+N (Mac)
            Firefox: Ctrl+Shift+P (Windows) or Cmd+Shift+P (Mac)
            Safari: File → New Private Window
            Edge: Ctrl+Shift+N
            
            Then navigate back to this page in the private/incognito window.
        `;
        
        alert(message);    }    logout() {
        try {
            localStorage.removeItem('KasOS-current-user');
            this.currentUser = null;
            this.hideDesktop();
            this.showLoginScreen();
            
            // Reset wallet authentication UI
            if (typeof this.resetWalletUI === 'function') {
                this.resetWalletUI();
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
      // Note: Wallet authentication methods are loaded from wallet-auth.js
    // This allows for better separation of concerns and easier maintenance
    
    // Check for existing wallet connection on page load (fallback method)
    async checkExistingWalletConnection() {
        try {
            const currentUser = localStorage.getItem('KasOS-current-user');
            if (currentUser) {
                const userData = JSON.parse(currentUser);
                
                // If user was authenticated via wallet, verify the connection is still valid
                if (userData.authMethod === 'wallet' && userData.address) {
                    if (typeof window.kasware !== 'undefined') {
                        // Check if wallet is still connected
                        const accounts = await window.kasware.getAccounts();
                        const connectedAccount = accounts.find(acc => acc.address === userData.address);
                        
                        if (connectedAccount) {
                            // Wallet is still connected, restore session
                            const walletUser = await this.getWalletUser(userData.address);
                            if (walletUser) {
                                this.currentUser = walletUser;
                                this.showDesktop();
                                console.log('Restored wallet session for:', walletUser.username);
                                return true;
                            }
                        }
                    }
                    
                    // Wallet disconnected or not available, clear session
                    localStorage.removeItem('KasOS-current-user');
                }
            }
            
            return false;
            
        } catch (error) {
            console.error('Error checking wallet connection:', error);
            return false;
        }
    }
      cleanupStorageBeforeLogin() {
        try {
            console.log('Starting comprehensive storage cleanup...');
            
            // Get current storage usage
            const initialUsage = this.getStorageUsage();
            console.log(`Initial storage usage: ${initialUsage.totalSize} bytes`);
            
            // 1. Clear all error logs and debugging data
            const errorHistory = localStorage.getItem('KasOS-error-history');
            if (errorHistory) {
                try {
                    const data = JSON.parse(errorHistory);
                    if (data.errors && data.errors.length > 5) {
                        // Keep only the last 5 errors
                        data.errors = data.errors.slice(0, 5);
                        localStorage.setItem('KasOS-error-history', JSON.stringify(data));
                    }
                } catch (e) {
                    localStorage.removeItem('KasOS-error-history');
                }
            }
            
            // 2. Clear all temporary and cache data
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('temp-') || 
                    key.includes('cache') || 
                    key.includes('session-') ||
                    key.startsWith('debug-') ||
                    key.includes('log-') ||
                    key.includes('analytics-') ||
                    key.includes('metrics-')) {
                    try {
                        localStorage.removeItem(key);
                    } catch (e) {
                        // Ignore errors during cleanup
                    }
                }
            });
            
            // 3. Optimize user data storage - compress and clean
            this.optimizeUserData();
            
            // 4. Clear large file data if needed
            this.clearLargeFileData();
            
            // 5. Compress remaining data
            this.compressStorageData();
            
            const finalUsage = this.getStorageUsage();
            console.log(`Final storage usage: ${finalUsage.totalSize} bytes`);
            console.log(`Freed up: ${initialUsage.totalSize - finalUsage.totalSize} bytes`);
            
        } catch (e) {
            console.warn('Storage cleanup failed:', e);
        }
    }
    
    getStorageUsage() {
        let totalSize = 0;
        const details = {};
        
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                const size = localStorage[key].length + key.length;
                totalSize += size;
                
                if (key.startsWith('KasOS-')) {
                    details[key] = size;
                }
            }
        }
        
        return { totalSize, details };
    }
    
    optimizeUserData() {
        try {
            // Optimize notes data
            const notesData = localStorage.getItem('KasOS-notes');
            if (notesData && notesData.length > 10000) {
                try {
                    const notes = JSON.parse(notesData);
                    if (Array.isArray(notes)) {
                        // Keep only the 20 most recent notes
                        const optimizedNotes = notes
                            .sort((a, b) => new Date(b.modified || b.created) - new Date(a.modified || a.created))
                            .slice(0, 20);
                        localStorage.setItem('KasOS-notes', JSON.stringify(optimizedNotes));
                    }
                } catch (e) {
                    localStorage.removeItem('KasOS-notes');
                }
            }
            
            // Optimize file system data
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('KasOS-files-')) {
                    const data = localStorage.getItem(key);
                    if (data && data.length > 50000) { // Files larger than 50KB
                        try {
                            const fileData = JSON.parse(data);
                            // Remove old files, keep only recent ones
                            if (fileData.files && Array.isArray(fileData.files)) {
                                fileData.files = fileData.files
                                    .sort((a, b) => new Date(b.modified || b.created) - new Date(a.modified || a.created))
                                    .slice(0, 10); // Keep only 10 most recent files
                                localStorage.setItem(key, JSON.stringify(fileData));
                            }
                        } catch (e) {
                            localStorage.removeItem(key);
                        }
                    }
                }
            });
            
        } catch (e) {
            console.warn('User data optimization failed:', e);
        }
    }
    
    clearLargeFileData() {
        try {
            const largeItems = [];
            
            Object.keys(localStorage).forEach(key => {
                const size = localStorage[key].length;
                if (size > 100000) { // Items larger than 100KB
                    largeItems.push({ key, size });
                }
            });
            
            // Sort by size, largest first
            largeItems.sort((a, b) => b.size - a.size);
            
            // Remove the largest items that aren't critical
            largeItems.forEach(item => {
                if (!item.key.includes('KasOS-users') && 
                    !item.key.includes('KasOS-current-user')) {
                    try {
                        localStorage.removeItem(item.key);
                        console.log(`Removed large item: ${item.key} (${item.size} bytes)`);
                    } catch (e) {
                        // Ignore errors
                    }
                }
            });
            
        } catch (e) {
            console.warn('Large file cleanup failed:', e);
        }
    }
    
    compressStorageData() {
        try {
            // Simple compression for JSON data
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('KasOS-') && 
                    !key.includes('compressed') &&
                    localStorage[key].length > 1000) {
                    
                    try {
                        const data = localStorage.getItem(key);
                        // Simple compression: remove extra spaces and line breaks
                        if (data.includes('{') || data.includes('[')) {
                            const compressed = JSON.stringify(JSON.parse(data));
                            if (compressed.length < data.length) {
                                localStorage.setItem(key, compressed);
                            }
                        }
                    } catch (e) {
                        // Data might not be JSON, skip
                    }
                }
            });
            
        } catch (e) {
            console.warn('Data compression failed:', e);
        }
    }
    
    // Enhanced storage management with quota monitoring
    async saveToStorage(key, data, critical = false) {
        try {
            const serializedData = JSON.stringify(data);
            
            // Check if we have enough space
            const currentUsage = this.getStorageUsage();
            const estimatedNewSize = serializedData.length + key.length;
            const storageLimit = this.getStorageLimit();
            
            if (currentUsage.totalSize + estimatedNewSize > storageLimit * 0.8) {
                console.warn('Approaching storage limit, performing cleanup...');
                this.cleanupStorageBeforeLogin();
            }
            
            localStorage.setItem(key, serializedData);
            return true;
            
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                console.warn('Storage quota exceeded, attempting aggressive cleanup...');
                
                if (critical) {
                    // For critical data, try aggressive cleanup
                    this.aggressiveStorageCleanup();
                    try {
                        localStorage.setItem(key, JSON.stringify(data));
                        return true;
                    } catch (e) {
                        throw new Error('Unable to save critical data even after cleanup');
                    }
                } else {
                    throw error;
                }
            }
            throw error;
        }
    }
    
    aggressiveStorageCleanup() {
        try {
            console.log('Performing aggressive storage cleanup...');
            
            // Remove ALL non-essential data
            const essentialKeys = [
                'KasOS-current-user',
                'KasOS-users'
            ];
            
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('KasOS-') && !essentialKeys.includes(key)) {
                    try {
                        localStorage.removeItem(key);
                    } catch (e) {
                        // Ignore errors
                    }
                }
            });
            
            // Clear all non-KasOS data that might be taking space
            Object.keys(localStorage).forEach(key => {
                if (!key.startsWith('KasOS-')) {
                    try {
                        // Check if it's large
                        if (localStorage[key].length > 1000) {
                            localStorage.removeItem(key);
                        }
                    } catch (e) {
                        // Ignore errors
                    }
                }
            });
            
            console.log('Aggressive cleanup completed');
            
        } catch (e) {
            console.error('Aggressive cleanup failed:', e);
        }
    }
    
    getStorageLimit() {
        // Estimate storage limit (varies by browser)
        // Most browsers have 5-10MB limit for localStorage
        try {
            const testKey = 'KasOS-storage-test';
            let size = 0;
            const increment = 1024; // 1KB increments
            
            // This is a rough estimation
            return 5 * 1024 * 1024; // Assume 5MB limit as conservative estimate
            
        } catch (e) {
            return 10 * 1024 * 1024; // Default to 10MB
        }
    }
    
    showStorageCleanupDialog() {
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-family: Arial, sans-serif;
        `;
        
        dialog.innerHTML = `            <div style="background: #dc3545; padding: 30px; border-radius: 8px; max-width: 500px; text-align: center;">
                <h2>Storage Quota Exceeded</h2>
                <p>Your browser's local storage is full. To use KasOS, you need to clear some space.</p>
                <div style="margin: 20px 0;">
                    <button onclick="this.closest('div[style*=\"position: fixed\"]').remove(); window.KasOS.clearAllData()" style="background: white; color: #dc3545; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-right: 10px;">Clear All KasOS Data</button>
                    <button onclick="this.closest('div[style*=\"position: fixed\"]').remove()" style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">Cancel</button>
                </div>
                <p style="font-size: 12px; opacity: 0.8;">You can also manually clear your browser's local storage in browser settings.</p>
            </div>
        `;
        
        document.body.appendChild(dialog);
    }
    
    clearAllData() {
        if (confirm('This will delete ALL KasOS data including users, files, and settings. Continue?')) {
            try {
                // Clear all KasOS related data
                Object.keys(localStorage).forEach(key => {
                    if (key.startsWith('KasOS-')) {
                        localStorage.removeItem(key);
                    }
                });
                
                // Clear IndexedDB
                if ('indexedDB' in window) {
                    indexedDB.deleteDatabase('KasOSDB');
                }
                
                alert('All data cleared. Please refresh the page.');
                location.reload();
            } catch (e) {
                alert('Failed to clear data. Please manually clear browser storage.');
            }
        }
    }
    
    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
      async getUser(username) {
        return new Promise((resolve, reject) => {
            // If no database, try localStorage fallback
            if (!this.db) {
                try {
                    const users = JSON.parse(localStorage.getItem('KasOS-users') || '{}');
                    resolve(users[username] || null);
                    return;
                } catch (e) {
                    resolve(null);
                    return;
                }
            }
            
            const transaction = this.db.transaction(['users'], 'readonly');
            const store = transaction.objectStore('users');
            const request = store.get(username);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => {
                // Fallback to localStorage
                try {
                    const users = JSON.parse(localStorage.getItem('KasOS-users') || '{}');
                    resolve(users[username] || null);
                } catch (e) {
                    resolve(null);
                }
            };
        });
    }
      async saveUser(user) {
        return new Promise((resolve, reject) => {
            // Save to localStorage as primary method
            try {
                const users = JSON.parse(localStorage.getItem('KasOS-users') || '{}');
                users[user.username] = user;
                localStorage.setItem('KasOS-users', JSON.stringify(users));
                resolve(true);
            } catch (e) {
                reject(e);
                return;
            }
            
            // Also save to IndexedDB if available
            if (this.db) {
                const transaction = this.db.transaction(['users'], 'readwrite');
                const store = transaction.objectStore('users');
                const request = store.put(user);
                
                request.onsuccess = () => {
                    console.log('User also saved to IndexedDB');
                };
                request.onerror = () => {
                    console.warn('Failed to save to IndexedDB, but localStorage worked');
                };
            }
        });
    }
      initializeIndexedDB() {
        const request = indexedDB.open('KasOSDB', 2); // Increment version for new store
        
        request.onerror = () => {
            console.error('Failed to open IndexedDB');
        };
        
        request.onsuccess = () => {
            this.db = request.result;
        };
        
        request.onupgradeneeded = (event) => {
            this.db = event.target.result;
            
            // Create users store
            if (!this.db.objectStoreNames.contains('users')) {
                const userStore = this.db.createObjectStore('users', { keyPath: 'username' });
            }
            
            // Create files store
            if (!this.db.objectStoreNames.contains('files')) {
                const fileStore = this.db.createObjectStore('files', { keyPath: 'id', autoIncrement: true });
                fileStore.createIndex('path', 'path', { unique: false });
                fileStore.createIndex('username', 'username', { unique: false });
            }
            
            // Create storage store for overflow data
            if (!this.db.objectStoreNames.contains('storage')) {
                const storageStore = this.db.createObjectStore('storage', { keyPath: 'key' });
                storageStore.createIndex('timestamp', 'timestamp', { unique: false });
            }
            
            // Create wallet users store
            if (!this.db.objectStoreNames.contains('walletUsers')) {
                const walletStore = this.db.createObjectStore('walletUsers', { keyPath: 'address' });
            }
            
            console.log('IndexedDB stores initialized successfully');
        };
    }
      async checkAutoLogin() {
        console.log('🔍 Checking for existing sessions...');
        
        // Priority 1: Check for wallet session
        const walletSession = localStorage.getItem('KasOS-current-user');
        if (walletSession) {
            try {
                const sessionData = JSON.parse(walletSession);
                if (sessionData.authMethod === 'wallet' && sessionData.address && sessionData.username) {
                    console.log('[AUTO_LOGIN] Found wallet session for:', sessionData.username);
                    
                    // Check if wallet is still connected (if available)
                    if (typeof window.kasware !== 'undefined') {
                        try {
                            const accounts = await window.kasware.getAccounts();
                            if (accounts && accounts.length > 0) {
                                const connectedAddress = typeof accounts[0] === 'string' ? accounts[0] : 
                                    (accounts[0]?.address || accounts[0]?.btcAddress || accounts[0]?.kaspaAddress);
                                
                                if (connectedAddress === sessionData.address) {
                                    // Wallet still connected, restore session
                                    this.currentUser = sessionData;
                                    this.showDesktop();
                                    console.log('[AUTO_LOGIN] ✅ Wallet session restored');
                                    return true;
                                } else {
                                    // Wallet address changed, clear session
                                    localStorage.removeItem('KasOS-current-user');
                                    console.log('[AUTO_LOGIN] Wallet address changed, cleared session');
                                }
                            } else {
                                // No accounts, but keep session in case wallet reconnects
                                this.currentUser = sessionData;
                                this.showDesktop();
                                console.log('[AUTO_LOGIN] ✅ Wallet session restored (no wallet check)');
                                return true;
                            }
                        } catch (err) {
                            // Wallet error, but restore session anyway
                            this.currentUser = sessionData;
                            this.showDesktop();
                            console.log('[AUTO_LOGIN] ✅ Wallet session restored (wallet error)');
                            return true;
                        }
                    } else {
                        // Wallet extension not available, restore session anyway
                        this.currentUser = sessionData;
                        this.showDesktop();
                        console.log('[AUTO_LOGIN] ✅ Wallet session restored (no extension)');
                        return true;
                    }
                }
            } catch (e) {
                console.warn('[AUTO_LOGIN] Invalid wallet session data:', e);
                localStorage.removeItem('KasOS-current-user');
            }
        }
        
        // Priority 2: Check for traditional persistent login
        if (window.loginPersistence && window.loginPersistence.shouldAutoLogin()) {
            const storedUsername = window.loginPersistence.getStoredUsername();
            if (storedUsername) {
                try {
                    const user = await this.getUser(storedUsername);
                    if (user) {
                        this.currentUser = user;
                        this.showDesktop();
                        console.log('[AUTO_LOGIN] ✅ Traditional login restored for:', storedUsername);
                        return true;
                    } else {
                        window.loginPersistence.clearLoginState();
                        console.log('[AUTO_LOGIN] Traditional user not found, cleared persistence');
                    }
                } catch (e) {
                    console.warn('[AUTO_LOGIN] Error restoring traditional session:', e);
                }
            }
        }
        
        console.log('[AUTO_LOGIN] No valid session found');
        return false;
    }
    
    showDesktop() {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('desktop').classList.remove('hidden');
        
        if (this.currentUser) {
            document.getElementById('currentUser').textContent = this.currentUser.username;
        }
        
        // Load custom application shortcuts
        setTimeout(() => {
            this.loadCustomAppShortcuts();
        }, 300);
    }
    
    loadCustomAppShortcuts() {
        try {
            // Try to load any custom app shortcuts the user has added
            const customAppsData = localStorage.getItem('KasOS-custom-apps');
            let customApps = [];
            
            if (customAppsData) {
                const parsedData = JSON.parse(customAppsData);
                // Handle both array and object formats
                if (Array.isArray(parsedData)) {
                    customApps = parsedData;
                } else if (typeof parsedData === 'object' && parsedData !== null) {
                    // Convert object to array
                    customApps = Object.entries(parsedData).map(([id, app]) => ({
                        id: id,
                        name: app.name || id,
                        icon: app.icon || 'default-app.png'
                    }));
                }
            }
            
            // Create shortcuts for each custom app
            customApps.forEach(app => {
                if (app && app.id && app.name) {
                    try {
                        this.addAppShortcut(app.id, app.name, app.icon || 'default-app.png');
                    } catch (e) {
                        console.warn(`Failed to add shortcut for ${app.name}:`, e);
                    }
                }
            });
            
            console.log(`Loaded custom app shortcuts`);
        } catch (error) {
            console.warn('Failed to load custom app shortcuts:', error);
            // Non-critical error, can continue
        }
    }
    
    hideDesktop() {
        document.getElementById('desktop').classList.add('hidden');
    }
      showLoginScreen() {
        document.getElementById('loginScreen').classList.remove('hidden');
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.getElementById('loginError').textContent = '';
        
        // Reset wallet UI when showing login screen
        if (typeof this.resetWalletUI === 'function') {
            this.resetWalletUI();
        }
    }
    
    toggleStartMenu() {
        const startMenu = document.getElementById('startMenu');
        startMenu.classList.toggle('hidden');
    }
    
    hideStartMenu() {
        document.getElementById('startMenu').classList.add('hidden');
    }    launchApplication(appName) {
        console.log(`Launching application: ${appName}`);
        
        // Protection against rapid multiple launches of the same app
        if (!this._launchLock) {
            this._launchLock = {};
        }
        
        // If there's an active lock for this app and it's recent (within 500ms), skip this launch
        if (this._launchLock[appName] && (Date.now() - this._launchLock[appName]) < 500) {
            console.log(`Ignoring duplicate launch request for ${appName}`);
            return;
        }
        
        // Set the lock timestamp
        this._launchLock[appName] = Date.now();
        
        // Direct launch for App Manager
        if (appName === 'appmanager') {
            this.loadApplication(appName);
            this.hideStartMenu();
            return;
        }
        
        // Check if we have the application already loaded
        if (this.applications[appName]) {
            try {
                // Make sure to pass this KasOS instance
                this.applications[appName].init(this);
                return;
            } catch (error) {
                console.error(`Error launching ${appName}:`, error);
                if (window.errorSystem) {
                    window.errorSystem.log(`Failed to launch application ${appName}: ${error.message}`, 'APP', 'error');
                }
                this.showNotification(`Failed to launch ${appName}`, 'error');
                return;
            }
        }
        
        // Try to load from applications folder
        this.loadApplication(appName);
        this.hideStartMenu();
    }
      // Alias method for compatibility
    openApp(appName) {
        return this.launchApplication(appName);
    }
    
    // Enhanced KasWallet launch with diagnostics
    launchKasWallet() {
        console.log('🔍 Special KasWallet launch procedure...');
        
        // Check if KasWallet is already loaded
        if (this.applications['kaswallet']) {
            console.log('✅ KasWallet found in applications registry');
            try {
                this.applications['kaswallet'].init(this);
                if (window.errorSystem) {
                    window.errorSystem.log('KasWallet launched successfully from memory', 'KASWALLET', 'success');
                }
                return;
            } catch (error) {
                console.error('❌ Error launching KasWallet from memory:', error);
                if (window.errorSystem) {
                    window.errorSystem.log(`KasWallet launch error: ${error.message}`, 'KASWALLET', 'error');
                }
            }
        }
        
        // Check if KasWallet script is loaded
        const scripts = document.querySelectorAll('script[src*="kaswallet"]');
        if (scripts.length === 0) {
            console.warn('⚠️ KasWallet script not found in DOM');
            if (window.errorSystem) {
                window.errorSystem.log('KasWallet script not loaded in DOM', 'KASWALLET', 'warning');
            }
        } else {
            console.log(`📜 Found ${scripts.length} KasWallet script(s) in DOM`);
        }
        
        // Try to load KasWallet
        this.loadKasWalletWithDiagnostics();
    }
    
    loadKasWalletWithDiagnostics() {
        console.log('🔍 Loading KasWallet with full diagnostics...');
        
        // Check if window.kasware exists
        if (typeof window.kasware !== 'undefined') {
            console.log('✅ KasWare extension detected');
            if (window.errorSystem) {
                window.errorSystem.log('KasWare extension detected', 'KASWALLET', 'success');
            }
        } else {
            console.warn('⚠️ KasWare extension not detected');
            if (window.errorSystem) {
                window.errorSystem.log('KasWare extension not detected - wallet functionality may be limited', 'KASWALLET', 'warning');
            }
        }
        
        // Load the application
        fetch('applications/kaswallet.js')
            .then(response => {
                console.log(`📥 KasWallet fetch response: ${response.status} ${response.statusText}`);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                return response.text();
            })
            .then(code => {
                console.log(`📝 KasWallet code loaded (${code.length} characters)`);
                try {
                    // Evaluate the code
                    const app = eval(`(${code})`);
                    console.log('✅ KasWallet code evaluated successfully');
                    
                    // Validate app structure
                    if (!app || typeof app !== 'object') {
                        throw new Error('Invalid application structure - not an object');
                    }
                    
                    if (!app.id || app.id !== 'kaswallet') {
                        throw new Error(`Invalid application ID: expected 'kaswallet', got '${app.id}'`);
                    }
                    
                    if (typeof app.init !== 'function') {
                        throw new Error('Application missing init function');
                    }
                    
                    console.log('✅ KasWallet structure validation passed');
                    
                    // Store the application
                    this.applications['kaswallet'] = app;
                    console.log('✅ KasWallet stored in applications registry');
                    
                    // Initialize the application
                    console.log('🚀 Initializing KasWallet...');
                    app.init(this);
                    
                    if (window.errorSystem) {
                        window.errorSystem.log('KasWallet loaded and initialized successfully', 'KASWALLET', 'success');
                    }
                    
                    console.log('🎉 KasWallet launch completed successfully!');
                    
                } catch (evalError) {
                    console.error('❌ Error evaluating KasWallet code:', evalError);
                    if (window.errorSystem) {
                        window.errorSystem.log(`KasWallet evaluation error: ${evalError.message}`, 'KASWALLET', 'error');
                    }
                    this.showNotification(`Failed to load KasWallet: ${evalError.message}`, 'error');
                }
            })
            .catch(error => {
                console.error('❌ Error loading KasWallet:', error);
                if (window.errorSystem) {
                    window.errorSystem.log(`KasWallet load error: ${error.message}`, 'KASWALLET', 'error');
                }
                this.showNotification(`Failed to load KasWallet: ${error.message}`, 'error');
            });
    }loadApplication(appId) {
        // Load application directly with fetch to avoid script loading issues
        fetch(`applications/${appId}.js`)
            .then(response => response.text())
            .then(code => {
                try {
                    const app = eval(`(${code})`);
                    this.applications[appId] = app;
                    
                    // Initialize the app with proper KasOS instance
                    if (app.init) {
                        // Wrap app initialization in try-catch for better error handling
                        try {
                            app.init(this);
                        } catch (initError) {
                            console.error(`Error initializing ${appId}:`, initError);
                            if (window.errorSystem) {
                                window.errorSystem.log(`Failed to initialize application ${appId}: ${initError.message}`, 'APP', 'error');
                            }
                            this.showNotification(`Failed to initialize ${appId}`, 'error');
                            return;
                        }
                    }
                    
                    console.log(`Application ${appId} loaded successfully`);
                } catch (error) {
                    console.error(`Failed to parse application ${appId}:`, error);
                    // Log to error system if available
                    if (window.errorSystem) {
                        window.errorSystem.log(`Failed to load application ${appId}: ${error.message}`, 'APP', 'error');
                    }
                    this.showNotification(`Failed to load ${appId}`, 'error');
                }
            })
            .catch(error => {
                console.error(`Failed to load application ${appId}:`, error);
                // Log to error system if available
                if (window.errorSystem) {
                    window.errorSystem.log(`Failed to fetch application ${appId}: ${error.message}`, 'APP', 'error');
                }
                this.showNotification(`Application ${appId} not found`, 'error');
            });
    }
    
    createWindow(title, content, width = 600, height = 400) {
        const windowId = 'window-' + Date.now();
        
        // Make sure we're in the correct context
        if (typeof this.zIndex === 'undefined') {
            console.error('createWindow called with incorrect context');
            return null;
        }
        
        const windowElement = document.createElement('div');
        windowElement.className = 'window';
        windowElement.dataset.windowId = windowId;
        // Also set data-window-id for compatibility with existing apps
        windowElement.setAttribute('data-window-id', windowId);
        windowElement.style.cssText = `
            width: ${width}px;
            height: ${height}px;
            left: ${Math.random() * (window.innerWidth - width)}px;
            top: ${Math.random() * (window.innerHeight - height - 100)}px;
            z-index: ${++this.zIndex};
        `;
        
        windowElement.innerHTML = `
            <div class="window-header">
                <span class="window-title">${title}</span>
                <div class="window-controls">
                    <button class="minimize-btn">−</button>
                    <button class="maximize-btn">□</button>
                    <button class="close-btn">×</button>
                </div>
            </div>
            <div class="window-content">${content}</div>
        `;
        
        const desktop = document.getElementById('desktop');
        if (!desktop) {
            console.error('Desktop element not found');
            return null;
        }
        
        desktop.appendChild(windowElement);
        
        // Add window event handlers
        this.setupWindowEvents(windowElement);
        
        this.windows.push(windowElement);
        
        // Return object with expected structure for apps like Kasia
        return {
            id: windowId,
            element: windowElement,
            content: windowElement.querySelector('.window-content')
        };
    }
    
    setupWindowEvents(windowElement) {
        const header = windowElement.querySelector('.window-header');
        const closeBtn = windowElement.querySelector('.close-btn');
        const minimizeBtn = windowElement.querySelector('.minimize-btn');
        const maximizeBtn = windowElement.querySelector('.maximize-btn');
        
        // Close button
        closeBtn.addEventListener('click', () => {
            this.closeWindow(windowElement);
        });
        
        // Minimize button
        minimizeBtn.addEventListener('click', () => {
            windowElement.style.display = 'none';
        });
        
        // Maximize button
        maximizeBtn.addEventListener('click', () => {
            if (windowElement.classList.contains('maximized')) {
                windowElement.classList.remove('maximized');
                windowElement.style.cssText = windowElement.dataset.originalStyle || '';
            } else {
                windowElement.dataset.originalStyle = windowElement.style.cssText;
                windowElement.classList.add('maximized');
                windowElement.style.cssText = `
                    left: 0 !important;
                    top: 0 !important;
                    width: 100% !important;
                    height: calc(100% - 50px) !important;
                    z-index: ${windowElement.style.zIndex};
                `;
            }
        });
        
        // Make window draggable
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        
        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.window-controls')) return;
            
            isDragging = true;
            initialX = e.clientX - windowElement.offsetLeft;
            initialY = e.clientY - windowElement.offsetTop;
            
            windowElement.style.zIndex = ++this.zIndex;
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                
                windowElement.style.left = currentX + 'px';
                windowElement.style.top = currentY + 'px';
            }
        });
          document.addEventListener('mouseup', () => {
            isDragging = false;
        });
          // Debug button handler
        const debugButton = document.getElementById('debugButton');
        if (debugButton) {
            debugButton.addEventListener('click', () => {
                if (window.errorSystem) {
                    window.errorSystem.toggleDebugConsole();
                } else {
                    console.log('Error system not available');
                }
            });
        }
        
        // KasWallet diagnostic button handler
        const kaswalletDiagButton = document.getElementById('kaswalletDiagButton');
        if (kaswalletDiagButton) {
            kaswalletDiagButton.addEventListener('click', () => {
                if (window.KasOSDiagnostics) {
                    window.KasOSDiagnostics.diagnoseKasWallet();
                    if (window.errorSystem) {
                        window.errorSystem.toggleDebugConsole();
                    }
                } else {
                    console.log('Diagnostics system not available');
                }
            });
        }
    }
    
    closeWindow(windowElement) {
        windowElement.remove();
        this.windows = this.windows.filter(w => w !== windowElement);
    }
    
    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; margin-left: 10px;">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        if (duration > 0) {
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, duration);
        }
    }
    
    getNotificationColor(type) {
        const colors = {
            info: '#17a2b8',
            success: '#28a745',
            warning: '#ffc107',
            error: '#dc3545'
        };
        return colors[type] || colors.info;
    }
      updateClock() {
        const clockElement = document.getElementById('clock');
        if (clockElement) {
            const now = new Date();
            clockElement.textContent = now.toLocaleTimeString();
        }
        
        setTimeout(() => this.updateClock(), 1000);
    }
    
    // Enhanced Storage Management
    async initializeStorageManager() {
        this.storageManager = {
            // Request persistent storage for larger quota (25-50MB)
            requestPersistentStorage: async function() {
                try {
                    if ('storage' in navigator && 'persist' in navigator.storage) {
                        const persistent = await navigator.storage.persist();
                        if (persistent) {
                            console.log('✅ Persistent storage granted - quota increased to ~25-50MB');
                            return true;
                        } else {
                            console.log('❌ Persistent storage denied');
                        }
                    }
                    return false;
                } catch (e) {
                    console.warn('Failed to request persistent storage:', e);
                    return false;
                }
            },
            
            // Get actual storage usage and quota
            getStorageUsage: async function() {
                try {
                    if ('storage' in navigator && 'estimate' in navigator.storage) {
                        const estimate = await navigator.storage.estimate();
                        return {
                            total: estimate.usage || 0,
                            quota: estimate.quota || 0,
                            available: (estimate.quota || 0) - (estimate.usage || 0)
                        };
                    }
                    
                    // Fallback: estimate localStorage usage
                    let localStorageSize = 0;
                    for (let key in localStorage) {
                        if (localStorage.hasOwnProperty(key)) {
                            localStorageSize += localStorage[key].length + key.length;
                        }
                    }
                    
                    return {
                        total: localStorageSize,
                        quota: 50 * 1024 * 1024, // 50MB estimate
                        available: (50 * 1024 * 1024) - localStorageSize
                    };
                } catch (e) {
                    console.warn('Failed to get storage usage:', e);
                    return { total: 0, quota: 0, available: 0 };
                }
            },
            
            // Show storage management dialog
            showStorageManager: function() {
                const dialog = document.createElement('div');
                dialog.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.8);
                    z-index: 10001;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #333;
                    font-family: Arial, sans-serif;
                `;
                
                dialog.innerHTML = `
                    <div style="background: white; padding: 30px; border-radius: 8px; max-width: 600px; width: 90%;">
                        <h2 style="margin-top: 0;">📊 Storage Management</h2>
                        <div id="storageInfo" style="margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 4px;">
                            <div>📋 Checking storage usage...</div>
                        </div>
                          <h3>💾 Increase Storage Quota (500MB-2GB)</h3>
                        <p>To increase storage capacity from ~100MB to 500MB-2GB:</p>
                        <ol style="text-align: left;">
                            <li><strong>Automatic:</strong> Click "Request Persistent Storage" below</li>
                            <li><strong>Manual:</strong> In browser address bar, click the lock/info icon → Site Settings → Storage → Allow</li>
                            <li><strong>Chrome:</strong> Enable "Storage" permission for this site</li>
                            <li><strong>Firefox:</strong> Allow persistent storage when prompted</li>
                        </ol>
                          <div style="margin: 20px 0;">
                            <button onclick="window.KasOS.requestStorageIncrease()" style="background: #28a745; color: white; border: none; padding: 12px 20px; border-radius: 4px; cursor: pointer; margin-right: 10px;">🚀 Request Persistent Storage</button>
                            <button onclick="window.KasOS.optimizeStorage()" style="background: #17a2b8; color: white; border: none; padding: 12px 20px; border-radius: 4px; cursor: pointer; margin-right: 10px;">🗜️ Optimize Storage</button>
                            <button onclick="this.closest('div[style*=\"position: fixed\"]').remove()" style="background: #6c757d; color: white; border: none; padding: 12px 20px; border-radius: 4px; cursor: pointer;">Close</button>
                        </div>
                        
                        <div style="font-size: 12px; color: #666; margin-top: 15px;">
                            <strong>Note:</strong> Persistent storage prevents data loss and increases quota.
                        </div>
                    </div>
                `;
                
                document.body.appendChild(dialog);
                
                // Update storage info
                this.getStorageUsage().then(usage => {
                    const info = document.getElementById('storageInfo');
                    if (info && usage.quota) {
                        const usedMB = (usage.total / (1024 * 1024)).toFixed(1);
                        const totalMB = (usage.quota / (1024 * 1024)).toFixed(0);
                        const percentage = ((usage.total / usage.quota) * 100).toFixed(1);
                        
                        info.innerHTML = `
                            <div><strong>💾 Storage Usage:</strong> ${usedMB}MB / ${totalMB}MB (${percentage}%)</div>
                            <div><strong>📈 Available:</strong> ${((usage.available || 0) / (1024 * 1024)).toFixed(1)}MB</div>
                            <div><strong>📊 Quota Type:</strong> ${usage.quota > 100 * 1024 * 1024 ? 'Persistent (Large)' : 'Temporary (Limited)'}</div>
                        `;
                    }
                });
            }
        };
        
        // Auto-request persistent storage on init
        try {
            await this.storageManager.requestPersistentStorage();
        } catch (e) {
            console.warn('Failed to auto-request persistent storage:', e);
        }
    }
    
    // Public methods for storage management
    async requestStorageIncrease() {
        try {
            console.log('Requesting persistent storage for 500MB-2GB capacity...');
            
            // Request persistent storage for 500MB-2GB capacity
            if ('storage' in navigator && 'persist' in navigator.storage) {
                const persistent = await navigator.storage.persist();
                if (persistent) {
                    this.showNotification('✅ Persistent storage granted! You now have 25-50MB capacity', 'success', 5000);
                    
                    // Get updated quota information
                    if ('estimate' in navigator.storage) {
                        const estimate = await navigator.storage.estimate();
                        const quotaMB = Math.round(estimate.quota / (1024 * 1024));
                        this.showNotification(`📊 Storage capacity: ${quotaMB}MB available`, 'success', 3000);
                    }
                    return true;
                } else {
                    this.showNotification('⚠️ Persistent storage not granted - limited to ~5MB', 'warning', 5000);
                    return false;
                }
            } else {
                this.showNotification('❌ Storage API not supported in this browser', 'error');
                return false;
            }
        } catch (error) {
            console.error('Failed to request storage increase:', error);
            this.showNotification('Failed to request storage increase', 'error');
            return false;
        }
    }
    
    // Storage Management Methods for Settings Integration
    async getStorageEstimate() {
        try {
            if ('storage' in navigator && 'estimate' in navigator.storage) {
                return await navigator.storage.estimate();
            }
            return { quota: 50 * 1024 * 1024, usage: 0 }; // Default 50MB
        } catch (error) {
            console.error('Failed to get storage estimate:', error);
            return { quota: 5 * 1024 * 1024, usage: 0 };
        }
    }
    
    // Create desktop and start menu icons for an application
    addAppShortcut(appId, appName, appIcon) {
        try {
            // Add desktop icon
            this.createDesktopIcon(appId, appName, appIcon);
            
            // Add start menu icon
            this.createStartMenuIcon(appId, appName, appIcon);
            
            console.log(`Created shortcuts for ${appName}`);
            return true;
        } catch (error) {
            console.error('Failed to create app shortcuts:', error);
            return false;
        }
    }
    
    // NEW: Method to add a quick access shortcut for the AI Assistant
    addAIAssistantShortcut() {
        try {
            // Create an AI assistant button in the taskbar for quick access
            const taskbar = document.querySelector('.taskbar');
            if (taskbar && !document.getElementById('ai-quick-access')) {
                const aiButton = document.createElement('button');
                aiButton.id = 'ai-quick-access';
                aiButton.className = 'ai-assistant-button';
                aiButton.innerHTML = '🤖';
                aiButton.title = 'Open AI Assistant';
                aiButton.style.cssText = 'background: none; border: none; font-size: 18px; cursor: pointer; margin: 0 5px; opacity: 0.7; transition: opacity 0.2s;';
                
                aiButton.addEventListener('mouseover', () => aiButton.style.opacity = '1');
                aiButton.addEventListener('mouseout', () => aiButton.style.opacity = '0.7');
                aiButton.addEventListener('click', () => {
                    if (this.applications && this.applications['ai-assistant']) {
                        this.launchApplication('ai-assistant');
                    }
                });
                
                // Insert before the clock
                const clock = taskbar.querySelector('.clock');
                if (clock) {
                    taskbar.insertBefore(aiButton, clock);
                } else {
                    taskbar.appendChild(aiButton);
                }
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to add AI Assistant shortcut:', error);
            return false;
        }
    }
    
    createDesktopIcon(appId, appName, iconSrc = 'default-app.png') {
        try {
            const desktopArea = document.querySelector('.desktop-icons');
            if (!desktopArea) return false;
            
            // Check if icon already exists
            const existingIcon = document.querySelector(`.desktop-icon[data-app="${appId}"]`);
            if (existingIcon) return true; // Already exists
            
            const icon = document.createElement('div');
            icon.className = 'desktop-icon';
            icon.dataset.app = appId;
            
            icon.innerHTML = `
                <img src="/icons/${iconSrc}" alt="${appName}" onerror="this.src='/icons/default-app.png';">
                <span>${appName}</span>
            `;
            
            // Add event handler for launching app
            icon.addEventListener('dblclick', () => {
                this.launchApplication(appId);
            });
            
            desktopArea.appendChild(icon);
            return true;
        } catch (error) {
            console.error('Failed to create desktop icon:', error);
            return false;
        }
    }
    
    createStartMenuIcon(appId, appName, iconSrc = 'default-app.png') {
        try {
            const startMenu = document.getElementById('startMenu');
            if (!startMenu) return false;
            
            // Check if icon already exists
            const existingIcon = startMenu.querySelector(`.start-app[data-app="${appId}"]`);
            if (existingIcon) return true; // Already exists
            
            const menuItem = document.createElement('div');
            menuItem.className = 'start-app';
            menuItem.dataset.app = appId;
            
            menuItem.innerHTML = `
                <img src="/icons/${iconSrc}" alt="${appName}" onerror="this.src='/icons/default-app.png';">
                <span>${appName}</span>
            `;
            
            // Add event handler for launching app
            menuItem.addEventListener('click', () => {
                this.launchApplication(appId);
                this.hideStartMenu();
            });
            
            startMenu.appendChild(menuItem);
            return true;
        } catch (error) {
            console.error('Failed to create start menu icon:', error);
            return false;
        }
    }
}

// Initialize KasOS immediately when this script loads
if (typeof window.KasOS === 'undefined') {
    console.log('Creating global KasOS instance...');
    window.KasOS = new KasOS();
}

// Enhanced Storage Management System for 25-50MB capacity
class EnhancedStorageManager {
    constructor() {        this.storageTypes = {
            localStorage: { limit: 10, available: true },
            indexedDB: { limit: 500, available: true },
            opfs: { limit: 2000, available: false }, // Origin Private File System
            webLocks: { limit: 100, available: false }
        };
        
        this.init();
    }
    
    async init() {
        // Check for modern storage APIs
        await this.checkStorageCapabilities();
        await this.requestPersistentStorage();
        this.setupStorageQuotaMonitoring();
    }
    
    async checkStorageCapabilities() {
        // Check for Origin Private File System (OPFS)
        if ('storage' in navigator && 'getDirectory' in navigator.storage) {
            this.storageTypes.opfs.available = true;
            console.log('OPFS available - can use up to 1GB+');
        }
        
        // Check for Web Locks API
        if ('locks' in navigator) {
            this.storageTypes.webLocks.available = true;
        }
        
        // Check for Storage API quotas
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            const estimate = await navigator.storage.estimate();
            console.log('Storage quota estimate:', estimate);
            
            if (estimate.quota > 50 * 1024 * 1024) {
                this.storageTypes.indexedDB.limit = Math.floor(estimate.quota / (1024 * 1024));
            }
        }
    }
    
    async requestPersistentStorage() {
        if ('storage' in navigator && 'persist' in navigator.storage) {
            try {
                const persistent = await navigator.storage.persist();
                if (persistent) {
                    console.log('Persistent storage granted - data won\'t be evicted');
                } else {
                    console.log('Persistent storage denied - data may be evicted under pressure');
                }
            } catch (e) {
                console.warn('Failed to request persistent storage:', e);
            }
        }
    }
    
    async setupStorageQuotaMonitoring() {
        // Monitor storage usage every 30 seconds
        setInterval(async () => {
            if ('storage' in navigator && 'estimate' in navigator.storage) {
                const estimate = await navigator.storage.estimate();
                const usagePercent = (estimate.usage / estimate.quota) * 100;
                
                if (usagePercent > 80) {
                    console.warn(`Storage usage high: ${usagePercent.toFixed(1)}%`);
                    this.triggerSmartCleanup();
                }
            }
        }, 30000);
    }
    
    async save(key, data, options = {}) {
        const { priority = 'normal', compress = true, fallback = true } = options;
        
        let serializedData = JSON.stringify(data);
        
        // Compress large data
        if (compress && serializedData.length > 1000) {
            serializedData = this.compressData(serializedData);
        }
        
        const size = serializedData.length;
        
        // Choose storage backend based on size and priority
        if (size < 4000 && priority === 'fast') {
            // Small, fast access data -> localStorage
            return await this.saveToLocalStorage(key, serializedData, fallback);
        } else if (size < 100000) {
            // Medium data -> IndexedDB
            return await this.saveToIndexedDB(key, serializedData, fallback);
        } else if (this.storageTypes.opfs.available) {
            // Large data -> OPFS
            return await this.saveToOPFS(key, serializedData, fallback);
        } else {
            // Fallback to chunked IndexedDB
            return await this.saveChunkedToIndexedDB(key, serializedData);
        }
    }
    
    async saveToLocalStorage(key, data, fallback = true) {
        try {
            localStorage.setItem(key, data);
            return { success: true, backend: 'localStorage' };
        } catch (error) {
            if (fallback && error.name === 'QuotaExceededError') {
                return await this.saveToIndexedDB(key, data);
            }
            throw error;
        }
    }
    
    async saveToIndexedDB(key, data, fallback = true) {
        try {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open('KasOSStorage', 1);
                
                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains('storage')) {
                        db.createObjectStore('storage', { keyPath: 'key' });
                    }
                };
                
                request.onsuccess = (event) => {
                    const db = event.target.result;
                    const transaction = db.transaction(['storage'], 'readwrite');
                    const store = transaction.objectStore('storage');
                    
                    const saveRequest = store.put({
                        key: key,
                        data: data,
                        timestamp: Date.now(),
                        compressed: true
                    });
                    
                    saveRequest.onsuccess = () => {
                        resolve({ success: true, backend: 'indexedDB' });
                    };
                    
                    saveRequest.onerror = () => {
                        if (fallback) {
                            this.saveToOPFS(key, data).then(resolve).catch(reject);
                        } else {
                            reject(saveRequest.error);
                        }
                    };
                };
                
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            if (fallback && this.storageTypes.opfs.available) {
                return await this.saveToOPFS(key, data);
            }
            throw error;
        }
    }
    
    async saveToOPFS(key, data, fallback = true) {
        try {
            if (!this.storageTypes.opfs.available) {
                throw new Error('OPFS not available');
            }
            
            const opfsRoot = await navigator.storage.getDirectory();
            const fileHandle = await opfsRoot.getFileHandle(`${key}.json`, { create: true });
            const writable = await fileHandle.createWritable();
            
            await writable.write(data);
            await writable.close();
            
            return { success: true, backend: 'opfs' };
        } catch (error) {
            if (fallback) {
                return await this.saveChunkedToIndexedDB(key, data);
            }
            throw error;
        }
    }
    
    async saveChunkedToIndexedDB(key, data) {
        try {
            const chunkSize = 50000; // 50KB chunks
            const chunks = [];
            
            for (let i = 0; i < data.length; i += chunkSize) {
                chunks.push(data.slice(i, i + chunkSize));
            }
            
            const metadata = {
                key: key,
                totalChunks: chunks.length,
                originalSize: data.length,
                timestamp: Date.now()
            };
            
            // Save metadata
            await this.saveToIndexedDB(`${key}_meta`, JSON.stringify(metadata), false);
            
            // Save chunks
            for (let i = 0; i < chunks.length; i++) {
                await this.saveToIndexedDB(`${key}_chunk_${i}`, chunks[i], false);
            }
            
            return { success: true, backend: 'indexedDB_chunked' };
        } catch (error) {
            throw new Error(`Failed to save chunked data: ${error.message}`);
        }
    }
    
    async load(key) {
        // Try localStorage first (fastest)
        try {
            const data = localStorage.getItem(key);
            if (data !== null) {
                return this.decompressData(data);
            }
        } catch (e) {
            // Continue to next storage type
        }
        
        // Try IndexedDB
        try {
            const result = await this.loadFromIndexedDB(key);
            if (result !== null) {
                return this.decompressData(result);
            }
        } catch (e) {
            // Continue to next storage type
        }
        
        // Try OPFS
        if (this.storageTypes.opfs.available) {
            try {
                const result = await this.loadFromOPFS(key);
                if (result !== null) {
                    return this.decompressData(result);
                }
            } catch (e) {
                // Continue to chunked loading
            }
        }
        
        // Try chunked loading
        try {
            return await this.loadChunkedFromIndexedDB(key);
        } catch (e) {
            return null;
        }
    }
    
    compressData(data) {
        // Simple compression for JSON data
        try {
            const parsed = JSON.parse(data);
            return JSON.stringify(parsed); // Remove extra whitespace
        } catch (e) {
            return data; // Return as-is if not JSON
        }
    }
    
    decompressData(data) {
        try {
            return JSON.parse(data);
        } catch (e) {
            return data;
        }
    }
    
    async getStorageUsage() {
        const usage = {
            localStorage: 0,
            indexedDB: 0,
            opfs: 0,
            total: 0
        };
        
        // Calculate localStorage usage
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                usage.localStorage += localStorage[key].length + key.length;
            }
        }
        
        // Use Storage API if available
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            const estimate = await navigator.storage.estimate();
            usage.total = estimate.usage || 0;
            usage.quota = estimate.quota || 0;
        }
        
        return usage;
    }
      async triggerSmartCleanup() {
        console.log('Triggering smart cleanup due to high storage usage...');
        
        // Remove old temporary data
        await this.cleanupTemporaryData();
        
        // Compress existing data
        await this.compressExistingData();
        
        // Move old data to OPFS if available
        if (this.storageTypes.opfs.available) {
            await this.migrateOldDataToOPFS();
        }
    }
}

// Initialize KasOS when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the global KasOS instance if not already created
    if (!window.KasOS || typeof window.KasOS.launchApplication !== 'function') {
        console.log('Initializing KasOS...');
        window.KasOS = new KasOS();
    }
    
    // Check for persistent login on page load
    if (window.loginPersistence && window.loginPersistence.shouldAutoLogin()) {
        const storedUsername = window.loginPersistence.getStoredUsername();
        if (storedUsername) {
            console.log(`[KasOS] Attempting auto-login for user: ${storedUsername}`);
            
            // Check if user exists in localStorage
            const users = JSON.parse(localStorage.getItem('KasOS-users') || '{}');
            if (users[storedUsername]) {
                // Auto-login the user
                if (window.KasOS && window.KasOS.login) {
                    window.KasOS.currentUser = { username: storedUsername };
                    window.KasOS.showDesktop();
                    console.log(`[KasOS] Auto-login successful for user: ${storedUsername}`);
                } else {
                    // If KasOS isn't ready yet, try again after a short delay
                    setTimeout(() => {
                        if (window.KasOS && window.KasOS.login) {
                            window.KasOS.currentUser = { username: storedUsername };
                            window.KasOS.showDesktop();
                            console.log(`[KasOS] Auto-login successful for user: ${storedUsername}`);
                        }
                    }, 1000);
                }
            } else {
                console.log(`[KasOS] User ${storedUsername} not found, clearing persistent login`);
                window.loginPersistence.clearLoginState();
            }
        }
    }
});

// Extend the existing login function to save login state
if (window.KasOS && window.KasOS.login) {
    const originalLogin = window.KasOS.login;
    window.KasOS.login = function(username, password, rememberMe = true) {
        const result = originalLogin.call(this, username, password);
        if (result && window.loginPersistence) {
            window.loginPersistence.saveLoginState(username, rememberMe);
        }
        return result;
    };
}

// Extend the existing logout function to clear login state
if (window.KasOS && window.KasOS.logout) {
    const originalLogout = window.KasOS.logout;
    window.KasOS.logout = function() {
        if (window.loginPersistence) {
            window.loginPersistence.clearLoginState();
        }
        return originalLogout.call(this);
    };
}

window.KasOS.cleanupOldLocalStorageKeys = function() {
    const preserve = [
        'KasOS-current-user',
        'KasOS-users',
        'KasOS-settings',
        'KasOS-wallpaper',
        'KasOS-wallpaper-id'
    ];
    let removed = 0;
    Object.keys(localStorage).forEach(key => {
        if (!preserve.includes(key) && key.startsWith('KasOS-')) {
            localStorage.removeItem(key);
            removed++;
        }
    });
    return removed;
}