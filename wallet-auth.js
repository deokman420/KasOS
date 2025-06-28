/**
 * Wallet Authentication System for KasOS
 * Provides secure authentication via multiple wallet integrations including KasWare, MetaMask, and others
 */

// Wait for KasOS to be available and extend it
function initializeWalletAuth() {
    console.log('Attempting to initialize wallet authentication...');
    
    // Check multiple KasOS availability conditions
    const KasOSAvailable = (
        typeof window.KasOS !== 'undefined' && 
        window.KasOS &&
        (
            typeof window.KasOS.launchApplication === 'function' ||
            typeof window.KasOS.login === 'function' ||
            typeof window.KasOS.showDesktop === 'function' ||
            window.KasOS.constructor?.name === 'KasOS'
        )
    );
    
    // If KasOS is available, extend it with wallet functionality
    if (KasOSAvailable) {
        extendKasOSWithWallet();
    }
    
    // Return the availability status
    return KasOSAvailable;
}

// Function to extend KasOS with wallet functionality
function extendKasOSWithWallet() {
    console.log('Extending KasOS with wallet authentication...');
    
    // Add wallet providers configuration
    window.KasOS.walletProviders = {
        kasware: {
            name: 'KasWare',
            detectMethod: () => typeof window.kasware !== 'undefined',
            getAccounts: async () => {
                try {
                    return await window.kasware.getAccounts();
                } catch (error) {
                    console.error('Error getting KasWare accounts:', error);
                    return null;
                }
            },
            requestAccounts: async () => {
                try {
                    // Request access to KasWare accounts (opens extension if needed)
                    if (typeof window.kasware.connect === 'function') {
                        return await window.kasware.connect();
                    } else if (typeof window.kasware.requestAccounts === 'function') {
                        return await window.kasware.requestAccounts();
                    } else {
                        return await window.kasware.getAccounts();
                    }
                } catch (error) {
                    console.error('Error requesting KasWare accounts:', error);
                    return null;
                }
            }
        },
        metamask: {
            name: 'MetaMask',
            detectMethod: () => typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask,
            getAccounts: async () => {
                try {
                    return await window.ethereum.request({ method: 'eth_accounts' });
                } catch (error) {
                    console.error('Error getting MetaMask accounts:', error);
                    return null;
                }
            },
            requestAccounts: async () => {
                try {
                    // This will prompt the MetaMask extension to open if the user isn't logged in
                    return await window.ethereum.request({ method: 'eth_requestAccounts' });
                } catch (error) {
                    console.error('Error requesting MetaMask accounts:', error);
                    return null;
                }
            }
        },
        coinbase: {
            name: 'Coinbase Wallet',
            detectMethod: () => typeof window.ethereum !== 'undefined' && window.ethereum.isCoinbaseWallet,
            getAccounts: async () => {
                try {
                    return await window.ethereum.request({ method: 'eth_accounts' });
                } catch (error) {
                    console.error('Error getting Coinbase Wallet accounts:', error);
                    return null;
                }
            },
            requestAccounts: async () => {
                try {
                    return await window.ethereum.request({ method: 'eth_requestAccounts' });
                } catch (error) {
                    console.error('Error requesting Coinbase accounts:', error);
                    return null;
                }
            }
        }
    };

    // Detect available wallet providers
    window.KasOS.detectWalletProviders = function() {
        const available = {};
        const providers = window.KasOS.walletProviders;
        
        for (const key in providers) {
            if (providers[key].detectMethod()) {
                available[key] = providers[key];
            }
        }
        
        return available;
    };
    
    // Add wallet login method to KasOS object
    window.KasOS.walletLogin = async function(providerKey = null) {
        try {
            console.log('Attempting wallet login...');
            
            // Detect available wallet providers
            const availableProviders = window.KasOS.detectWalletProviders();
            
            // If no providers are available, show error
            if (Object.keys(availableProviders).length === 0) {
                console.error('No wallet extensions detected');
                window.KasOS.showNotification('No wallet extensions detected. Please install a supported wallet extension.', 'error');
                
                // Suggest wallet installation
                if (confirm('Would you like to install a supported wallet extension?')) {
                    // Open a generic crypto wallet comparison page instead of hardcoded MetaMask
                    window.open('https://ethereum.org/en/wallets/', '_blank');
                }
                return false;
            }
            
            // If provider is specified, use it
            // Otherwise use first available or KasWare if available
            let provider;
            if (providerKey && availableProviders[providerKey]) {
                provider = availableProviders[providerKey];
            } else {
                provider = availableProviders.kasware || 
                          availableProviders.metamask || 
                          availableProviders.coinbase || 
                          Object.values(availableProviders)[0];
                providerKey = Object.keys(availableProviders).find(key => availableProviders[key] === provider);
            }
            
            console.log(`Using ${provider.name} wallet provider`);
            
            // First try getting accounts (non-interactive)
            let accounts = await provider.getAccounts();
            
            // If no accounts, request accounts (interactive, opens extension)
            if (!accounts || accounts.length === 0) {
                console.log('No wallet accounts found. Prompting extension to connect...');
                window.KasOS.showNotification(`No wallet accounts found. Opening ${provider.name} extension...`, 'info');
                
                // Request accounts (will open extension UI)
                accounts = await provider.requestAccounts();
            }
            
            if (!accounts || accounts.length === 0) {
                console.error('No wallet accounts found after prompt');
                window.KasOS.showNotification(`No wallet accounts found. Please unlock your ${provider.name} wallet.`, 'warning');
                return false;
            }
            
            // Get the first account address
            const address = accounts[0].address || accounts[0];
            console.log(`${provider.name} wallet connected:`, address);
            
            // Create or get wallet user
            const walletUser = await getOrCreateWalletUser(address, providerKey);
            
            // Store user session
            const userData = {
                username: walletUser.username,
                address: address,
                authMethod: 'wallet',
                walletProvider: providerKey,
                walletName: provider.name,
                loginTime: new Date().toISOString()
            };
            
            // Save to localStorage
            localStorage.setItem('KasOS-current-user', JSON.stringify(userData));
            localStorage.setItem('walletConnected', 'true');
            localStorage.setItem('walletAddress', address);
            localStorage.setItem('walletProvider', providerKey);
            
            // Update KasOS current user
            window.KasOS.currentUser = userData;
            window.KasOS.showDesktop();
            
            // Show success notification
            window.KasOS.showNotification(`Successfully logged in with ${provider.name} wallet`, 'success');
            
            // Update UI safely
            try {
                updateWalletUI(address, provider.name);
            } catch (uiError) {
                console.warn('Non-critical UI update error:', uiError);
            }
            
            return true;
            
        } catch (error) {
            console.error('Wallet login error:', error);
            window.KasOS.showNotification('Wallet login failed: ' + error.message, 'error');
            return false;
        }
    };
    
    // Add method to check wallet connection status
    window.KasOS.checkWalletConnection = async function() {
        try {
            // Get stored wallet provider
            const providerKey = localStorage.getItem('walletProvider') || 'kasware';
            const availableProviders = window.KasOS.detectWalletProviders();
            
            if (!availableProviders[providerKey]) {
                return { connected: false, reason: 'extension_not_found' };
            }
            
            const provider = availableProviders[providerKey];
            const accounts = await provider.getAccounts();
            
            return { 
                connected: !!accounts && accounts.length > 0,
                address: accounts && accounts.length > 0 ? (accounts[0].address || accounts[0]) : null,
                provider: providerKey,
                providerName: provider.name
            };
        } catch (error) {
            console.error('Error checking wallet connection:', error);
            return { connected: false, reason: 'error', details: error.message };
        }
    };
    
    // Add method to reset wallet UI state
    window.KasOS.resetWalletUI = function() {
        // More comprehensive UI reset
        console.log('Resetting wallet UI state');
        
        // Clear any displayed wallet data
        const walletElements = document.querySelectorAll('[data-wallet-display]');
        walletElements.forEach(el => {
            el.textContent = '';
            el.value = '';
        });
        
        // Reset wallet status indicators
        const statusElements = document.querySelectorAll('.wallet-status, .connection-status');
        statusElements.forEach(el => {
            el.textContent = 'Disconnected';
            el.className = el.className.replace(/status-\w+/g, 'status-disconnected');
        });
    };
    
    // Add method to hard reset (clear all wallet data)
    window.KasOS.hardResetWallet = function() {
        console.log('Performing hard reset on wallet data');
        
        // First reset the UI
        window.KasOS.resetWalletUI();
        
        // Clear all wallet-related localStorage items
        Object.keys(localStorage).forEach(key => {
            if (key.includes('wallet') || 
                key.includes('kas') || 
                key.includes('account') ||
                key.includes('transaction') ||
                key.includes('auth')) {
                localStorage.removeItem(key);
            }
        });
        
        // Clear any sensitive session data
        if (sessionStorage) {
            Object.keys(sessionStorage).forEach(key => {
                if (key.includes('wallet') || 
                    key.includes('kas') || 
                    key.includes('account') ||
                    key.includes('transaction')) {
                    sessionStorage.removeItem(key);
                }
            });
        }
        
        // Reset global wallet state if applicable
        if (window.kasWalletApp) {
            window.kasWalletApp.isConnected = false;
            window.kasWalletApp.currentAccount = null;
        }
    };
    
    // Safe UI update helper function
    function updateWalletUI(address, providerName) {
        try {
            const statusElement = document.getElementById('wallet-connection-status');
            if (statusElement) {
                statusElement.textContent = 'Connected';
                statusElement.style.color = '#28a745';
            }
            
            const addressElement = document.getElementById('wallet-address');
            if (addressElement) {
                // Format address with ellipsis in the middle
                const shortAddress = address.substring(0, 6) + '...' + address.substring(address.length - 4);
                addressElement.textContent = `${shortAddress} (${providerName})`;
            }
            
            const connectButton = document.getElementById('wallet-connect-button');
            if (connectButton) {
                connectButton.textContent = 'Disconnect Wallet';
                connectButton.onclick = () => {
                    // Add disconnect functionality
                    localStorage.removeItem('walletConnected');
                    localStorage.removeItem('walletAddress');
                    localStorage.removeItem('walletProvider');
                    window.KasOS.resetWalletUI();
                };
            }
        } catch (error) {
            console.warn('Error updating wallet UI:', error);
        }
    }
    
    // Helper function to create or get wallet user
    async function getOrCreateWalletUser(address, providerKey) {
        // Implementation would normally interact with a backend
        // For now, we'll create a simple username based on the address and provider
        const shortAddress = address.substring(0, 6);
        const userName = `${providerKey}_${shortAddress}`;
        
        return {
            username: userName,
            address: address,
            provider: providerKey
        };
    }
}

// Initialize wallet authentication when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, attempting wallet auth initialization...');
    
    // Try immediately first
    if (initializeWalletAuth()) {
        return;
    }
    
    // If not successful, try again after a delay
    setTimeout(() => {
        console.log('Second attempt to initialize wallet authentication...');
        if (!initializeWalletAuth()) {
            console.error('Failed to initialize wallet authentication - KasOS not available after 1s');
        }
    }, 1000);
    
    // Final attempt after KasOS should be fully loaded
    setTimeout(() => {
        if (typeof window.KasOS !== 'undefined' && !window.KasOS.walletLogin) {
            console.log('Final attempt to initialize wallet authentication...');
            initializeWalletAuth();
        }
    }, 3000);
    
    // Listen for KasOS initialization event if it exists
    document.addEventListener('KasOS-ready', function() {
        console.log('KasOS ready event detected, initializing wallet auth...');
        if (!window.KasOS.walletLogin) {
            initializeWalletAuth();
        }
    });
});