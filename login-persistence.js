// Login Persistence Utility for KasOS
// Maintains user sessions across browser reloads

(function() {
    'use strict';
    
    const LOGIN_STORAGE_KEY = 'KasOS-persistent-login';
    const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    window.loginPersistence = {
        // Save login state
        saveLoginState: function(username, rememberMe = true) {
            if (!rememberMe) return;
            
            const loginData = {
                username: username,
                timestamp: Date.now(),
                sessionId: this.generateSessionId()
            };
            
            try {
                localStorage.setItem(LOGIN_STORAGE_KEY, JSON.stringify(loginData));
                console.log(`[LOGIN_PERSISTENCE] Saved login state for user: ${username}`);
            } catch (error) {
                console.warn('[LOGIN_PERSISTENCE] Failed to save login state:', error);
            }
        },
        
        // Load and validate login state
        loadLoginState: function() {
            try {
                const loginDataStr = localStorage.getItem(LOGIN_STORAGE_KEY);
                if (!loginDataStr) return null;
                
                const loginData = JSON.parse(loginDataStr);
                
                // Check if session has expired
                if (Date.now() - loginData.timestamp > SESSION_TIMEOUT) {
                    console.log('[LOGIN_PERSISTENCE] Session expired, clearing login state');
                    this.clearLoginState();
                    return null;
                }
                
                console.log(`[LOGIN_PERSISTENCE] Loaded valid session for user: ${loginData.username}`);
                return loginData;
            } catch (error) {
                console.warn('[LOGIN_PERSISTENCE] Failed to load login state:', error);
                this.clearLoginState();
                return null;
            }
        },
        
        // Clear login state (logout)
        clearLoginState: function() {
            try {
                localStorage.removeItem(LOGIN_STORAGE_KEY);
                console.log('[LOGIN_PERSISTENCE] Cleared login state');
            } catch (error) {
                console.warn('[LOGIN_PERSISTENCE] Failed to clear login state:', error);
            }
        },
        
        // Generate unique session ID
        generateSessionId: function() {
            return 'session_' + Math.random().toString(36).substr(2, 16) + '_' + Date.now();
        },
        
        // Check if user should be automatically logged in
        shouldAutoLogin: function() {
            const loginData = this.loadLoginState();
            return loginData !== null;
        },
        
        // Get stored username
        getStoredUsername: function() {
            const loginData = this.loadLoginState();
            return loginData ? loginData.username : null;
        },
        
        // Update session timestamp (keep session alive)
        refreshSession: function() {
            const loginData = this.loadLoginState();
            if (loginData) {
                loginData.timestamp = Date.now();
                try {
                    localStorage.setItem(LOGIN_STORAGE_KEY, JSON.stringify(loginData));
                } catch (error) {
                    console.warn('[LOGIN_PERSISTENCE] Failed to refresh session:', error);
                }
            }
        }
    };
    
    // Auto-refresh session every 30 minutes
    setInterval(() => {
        if (window.loginPersistence.shouldAutoLogin()) {
            window.loginPersistence.refreshSession();
        }
    }, 30 * 60 * 1000);
    
    console.log('[LOGIN_PERSISTENCE] Login persistence utility initialized');
})();