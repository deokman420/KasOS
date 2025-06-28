/**
 * Debug script for KasOS login system
 * This helps diagnose why login isn't working
 */

// Ensure debug functions are available immediately
console.log('🔍 Debug login script loading...');

// Debug function to test login system
window.debugLogin = function() {
    console.log('=== KasOS LOGIN DEBUG ===');
    
    // Check if KasOS is available
    console.log('1. KasOS availability:');
    console.log('   - window.KasOS exists:', !!window.KasOS);
    console.log('   - KasOS type:', typeof window.KasOS);
    console.log('   - KasOS constructor:', window.KasOS?.constructor?.name);
    console.log('   - login method exists:', typeof window.KasOS?.login);
    console.log('   - register method exists:', typeof window.KasOS?.register);
    
    // Check DOM elements
    console.log('2. DOM elements:');
    const elements = ['username', 'password', 'loginBtn', 'registerBtn', 'loginError'];
    elements.forEach(id => {
        const element = document.getElementById(id);
        console.log(`   - ${id}:`, !!element, element?.tagName);
    });
    
    // Check event listeners
    console.log('3. Event listeners:');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    console.log('   - Login button click handler:', !!loginBtn?.onclick);
    console.log('   - Register button click handler:', !!registerBtn?.onclick);
    
    // Check storage
    console.log('4. Storage:');
    try {
        const users = JSON.parse(localStorage.getItem('KasOS-users') || '{}');
        console.log('   - Existing users:', Object.keys(users));
        console.log('   - Current user:', localStorage.getItem('KasOS-current-user'));
    } catch (e) {
        console.log('   - Storage error:', e.message);
    }
    
    // Test login function directly
    console.log('5. Testing login function:');
    if (window.KasOS && typeof window.KasOS.login === 'function') {
        console.log('   - Login function is callable');
        
        // Test with dummy data
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        
        if (usernameInput && passwordInput) {
            console.log('   - Input fields available for testing');
            console.log('   - You can now try logging in or call testRegister()');
        } else {
            console.log('   - Input fields not found');
        }
    } else {
        console.log('   - Login function not available');
    }
    
    console.log('=== END DEBUG ===');
};

// Test registration function
window.testRegister = function(username = 'testuser', password = 'testpass') {
    console.log(`Testing registration with ${username}/${password}`);
    
    if (!window.KasOS || typeof window.KasOS.register !== 'function') {
        console.error('KasOS or register function not available');
        return;
    }
    
    // Fill form fields
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    if (usernameInput && passwordInput) {
        usernameInput.value = username;
        passwordInput.value = password;
        
        // Call register
        window.KasOS.register();
    } else {
        console.error('Input fields not found');
    }
};

// Test login function
window.testLogin = function(username = 'testuser', password = 'testpass') {
    console.log(`Testing login with ${username}/${password}`);
    
    if (!window.KasOS || typeof window.KasOS.login !== 'function') {
        console.error('KasOS or login function not available');
        return;
    }
    
    // Fill form fields
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    if (usernameInput && passwordInput) {
        usernameInput.value = username;
        passwordInput.value = password;
        
        // Call login
        window.KasOS.login();
    } else {
        console.error('Input fields not found');
    }
};

// Quick test login function - available immediately
window.quickLogin = function() {
    console.log('🔧 Quick login test...');
    
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    
    if (usernameInput && passwordInput) {
        usernameInput.value = 'admin';
        passwordInput.value = 'admin';
        
        // Try to click login button
        if (loginBtn && loginBtn.onclick) {
            loginBtn.onclick();
        } else if (window.KasOS && window.KasOS.login) {
            window.KasOS.login();
        } else {
            console.error('No login method available');
        }
    } else {
        console.error('Login form not found');
    }
};

// Quick register function
window.quickRegister = function() {
    console.log('🔧 Quick register test...');
    
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const registerBtn = document.getElementById('registerBtn');
    
    if (usernameInput && passwordInput) {
        usernameInput.value = 'admin';
        passwordInput.value = 'admin';
        
        // Try to click register button
        if (registerBtn && registerBtn.onclick) {
            registerBtn.onclick();
        } else if (window.KasOS && window.KasOS.register) {
            window.KasOS.register();
        } else {
            console.error('No register method available');
        }
    } else {
        console.error('Login form not found');
    }
};

// Debug function to validate core system state
window.debugLoginState = function() {
    console.log('=== LOGIN STATE DEBUG ===');
    
    // Check current user session
    console.log('1. Current user session:', localStorage.getItem('KasOS-current-user') ? JSON.parse(localStorage.getItem('KasOS-current-user')) : null);
    
    // Check wallet users
    console.log('2. Wallet users:', JSON.parse(localStorage.getItem('KasOS-wallet-users') || '{}'));
    
    // Check persistent login
    console.log('3. Persistent login:', localStorage.getItem('KasOS-persistent-login') ? JSON.parse(localStorage.getItem('KasOS-persistent-login')) : 'None');
    
    // Check KasOS current user
    console.log('4. KasOS current user:', window.KasOS?.currentUser || 'None');
    
    // Check desktop visibility
    const desktop = document.getElementById('desktop');
    const loginScreen = document.getElementById('loginScreen');
    console.log('5. Desktop visible:', !desktop?.classList.contains('hidden'));
    console.log('6. Login screen visible:', !loginScreen?.classList.contains('hidden'));
    
    // Check KasWare availability
    console.log('7. KasWare available:', typeof window.kasware !== 'undefined');
    if (typeof window.kasware !== 'undefined') {
        // Check connected accounts
        try {
            window.kasware.getAccounts().then(accounts => {
                console.log('   Connected accounts:', accounts);
            }).catch(err => {
                console.log('   Accounts error:', err.message);
            });
        } catch (e) {
            console.log('   KasWare access error:', e.message);
        }
    }
    
    console.log('=== END LOGIN STATE DEBUG ===');
};

// Force wallet session restore
window.forceWalletRestore = function() {
    console.log('🔧 Forcing wallet session restore...');
    
    const walletSession = localStorage.getItem('KasOS-current-user');
    if (walletSession) {
        try {
            const sessionData = JSON.parse(walletSession);
            console.log('Found user data:', sessionData);
            
            if (sessionData.authMethod === 'wallet' && sessionData.address) {
                console.log('User was authenticated via wallet, checking connection...');
                
                if (typeof window.kasware !== 'undefined') {
                    return window.kasware.getAccounts().then(accounts => {
                        console.log('Wallet accounts check result:', accounts);
                        
                        if (accounts && accounts.length > 0) {
                            const connectedAddress = typeof accounts[0] === 'string' ? accounts[0] : 
                                (accounts[0]?.address || accounts[0]?.btcAddress || accounts[0]?.kaspaAddress);
                            
                            console.log('Stored address:', sessionData.address);
                            console.log('Connected address:', connectedAddress);
                            
                            if (connectedAddress === sessionData.address) {
                                console.log('✅ Restoring wallet session for:', sessionData.username);
                                window.KasOS.currentUser = sessionData;
                                window.KasOS.showDesktop();
                                return true;
                            }
                        }
                        return false;
                    }).then(result => {
                        console.log('Restore result:', result);
                        if (result) {
                            console.log('✅ Wallet session force-restored successfully!');
                        } else {
                            console.log('❌ Could not restore wallet session');
                        }
                        return result;
                    });
                } else {
                    console.log('KasWare not available, restoring session anyway...');
                    window.KasOS.currentUser = sessionData;
                    window.KasOS.showDesktop();
                    console.log('✅ Session restored without wallet verification');
                    return Promise.resolve(true);
                }
            }
        } catch (e) {
            console.error('Error during force restore:', e);
        }
    } else {
        console.log('No wallet session found');
    }
    
    return Promise.resolve(false);
};

// Make functions available globally right away
if (typeof window !== 'undefined') {
    console.log('🔍 Making debug functions globally available');
    console.log('Functions ready:', {
        debugLogin: typeof window.debugLogin,
        testRegister: typeof window.testRegister,
        testLogin: typeof window.testLogin
    });
}

// Auto-run debug when script loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 Debug login script DOM loaded');
    setTimeout(() => {
        console.log('Auto-running login debug...');
        if (typeof window.debugLogin === 'function') {
            window.debugLogin();
        } else {
            console.error('debugLogin function not available');
        }
    }, 2000);
});

console.log('🔍 Debug login script loaded. Call debugLogin() to test.');
console.log('Available functions:', {
    debugLogin: typeof window.debugLogin,
    testRegister: typeof window.testRegister,
    testLogin: typeof window.testLogin
});