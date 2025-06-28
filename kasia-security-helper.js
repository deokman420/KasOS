/**
 * Kasia Security Helper - Enhanced security features from upstream
 * Provides rate limiting, memory management, and security controls
 */

class KasiaSecurityHelper {
    constructor() {
        this.decryptionAttempts = new Map();
        this.lastDecryptionTime = new Map();
        this.MAX_ATTEMPTS = 50; // Max attempts per message
        this.RATE_LIMIT_MS = 100; // Minimum time between attempts
        this.ATTEMPT_RESET_MS = 60000; // Reset attempts after 1 minute
        this.MEMORY_CLEAR_DELAY_MS = 30000; // Clear sensitive data after 30 seconds
    }

    /**
     * Check if decryption attempts are allowed for a message
     */
    canAttemptDecryption(messageId) {
        const attempts = this.decryptionAttempts.get(messageId) || 0;
        const lastAttempt = this.lastDecryptionTime.get(messageId) || 0;
        const now = Date.now();

        // Reset attempts if enough time has passed
        if (now - lastAttempt > this.ATTEMPT_RESET_MS) {
            this.decryptionAttempts.delete(messageId);
            this.lastDecryptionTime.delete(messageId);
            return true;
        }

        // Check attempt limit
        if (attempts >= this.MAX_ATTEMPTS) {
            console.warn(`🔒 Max decryption attempts reached for message ${messageId}`);
            return false;
        }

        // Check rate limit
        if (now - lastAttempt < this.RATE_LIMIT_MS) {
            console.warn(`🔒 Rate limit exceeded for message ${messageId}`);
            return false;
        }

        return true;
    }

    /**
     * Record a decryption attempt for a message
     */
    recordDecryptionAttempt(messageId) {
        const attempts = this.decryptionAttempts.get(messageId) || 0;
        this.decryptionAttempts.set(messageId, attempts + 1);
        this.lastDecryptionTime.set(messageId, Date.now());
    }

    /**
     * Clear sensitive data from memory
     */
    clearSensitiveData(privateKeyBytes) {
        if (!privateKeyBytes) return;
        
        // Schedule clearing of private key data
        setTimeout(() => {
            if (privateKeyBytes && privateKeyBytes.fill) {
                privateKeyBytes.fill(0); // Overwrite with zeros
                console.log('🔒 Cleared sensitive private key data from memory');
            }
        }, this.MEMORY_CLEAR_DELAY_MS);
    }

    /**
     * Get stats about decryption attempts
     */
    getDecryptionStats(messageId) {
        const attempts = this.decryptionAttempts.get(messageId) || 0;
        const lastAttempt = this.lastDecryptionTime.get(messageId) || 0;
        const now = Date.now();

        return {
            attempts,
            remainingAttempts: Math.max(0, this.MAX_ATTEMPTS - attempts),
            timeUntilReset: Math.max(0, this.ATTEMPT_RESET_MS - (now - lastAttempt)),
        };
    }

    /**
     * Secure random number generation with fallback
     */
    generateSecureRandom(length = 32) {
        try {
            const randomBytes = new Uint8Array(length);
            crypto.getRandomValues(randomBytes);
            return randomBytes;
        } catch (error) {
            console.warn('🔒 WebCrypto not available, using Math.random fallback');
            const fallbackBytes = new Uint8Array(length);
            for (let i = 0; i < length; i++) {
                fallbackBytes[i] = Math.floor(Math.random() * 256);
            }
            return fallbackBytes;
        }
    }

    /**
     * Validate Kaspa address format with enhanced checks
     */
    isValidKaspaAddress(address) {
        if (typeof address !== 'string') return false;
        
        // Check for both mainnet and testnet address formats
        const isMainnet = address.startsWith('kaspa:');
        const isTestnet = address.startsWith('kaspatest:');
        
        if (!isMainnet && !isTestnet) return false;
        
        // Check length constraints
        if (address.length < 60 || address.length > 80) return false;
        
        // Extract address part
        const addressPart = isMainnet ? address.substring(6) : address.substring(10);
        
        // Validate bech32 characters
        const validChars = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
        for (let i = 0; i < addressPart.length; i++) {
            if (validChars.indexOf(addressPart[i]) === -1) {
                return false;
            }
        }
        
        return true;
    }

    /**
     * Create secure wallet derivation seed
     */
    async createDerivationSeed(masterSeed, derivationType = 'standard') {
        const derivationInfo = derivationType === 'standard' ? 'standard-derivation' : 'legacy-derivation';
        const combinedSeed = new Uint8Array(masterSeed.length + derivationInfo.length);
        combinedSeed.set(masterSeed, 0);
        combinedSeed.set(new TextEncoder().encode(derivationInfo), masterSeed.length);
        
        // Hash the combined seed
        const hashBuffer = await crypto.subtle.digest('SHA-256', combinedSeed);
        return new Uint8Array(hashBuffer);
    }

    /**
     * Enhanced key derivation with multiple derivation paths
     */
    async deriveKeyFromPath(masterKey, derivationPath) {
        let currentKey = masterKey;
        
        for (const pathComponent of derivationPath) {
            const pathBytes = new TextEncoder().encode(pathComponent.toString());
            const combinedData = new Uint8Array(currentKey.length + pathBytes.length);
            combinedData.set(currentKey, 0);
            combinedData.set(pathBytes, currentKey.length);
            
            const hashBuffer = await crypto.subtle.digest('SHA-256', combinedData);
            currentKey = new Uint8Array(hashBuffer);
        }
        
        return currentKey;
    }

    /**
     * Memory-safe string comparison
     */
    secureStringCompare(str1, str2) {
        if (str1.length !== str2.length) {
            return false;
        }
        
        let result = 0;
        for (let i = 0; i < str1.length; i++) {
            result |= str1.charCodeAt(i) ^ str2.charCodeAt(i);
        }
        
        return result === 0;
    }

    /**
     * Log security events
     */
    logSecurityEvent(event, details = {}) {
        const timestamp = new Date().toISOString();
        console.log(`🔒 [${timestamp}] Security Event: ${event}`, details);
    }
}

// Make available globally
window.KasiaSecurityHelper = KasiaSecurityHelper;

console.log('🔒 Kasia Security Helper loaded - Enhanced security features available');
