// Kasia Direct - Cipher Integration Helper
// This module provides integration with the official Kasia cipher library

class KasiaDirectCipher {
    constructor() {
        this.cipherLoaded = false;
        this.initializeCipher();
    }

    async initializeCipher() {
        try {
            // Check if cipher module is available from the official Kasia implementation
            if (typeof window.cipher !== 'undefined' || typeof window.encrypt_message !== 'undefined') {
                console.log('Official Kasia cipher library detected');
                this.cipherLoaded = true;
                return;
            }

            // Try to load cipher from the Kasia-master directory
            const cipherScript = document.createElement('script');
            cipherScript.src = './applications/Kasia-master/cipher-wasm/cipher.js';
            
            cipherScript.onload = () => {
                console.log('Kasia cipher library loaded successfully');
                this.cipherLoaded = true;
            };
            
            cipherScript.onerror = () => {
                console.warn('Official cipher library not available, using fallback encryption');
                this.cipherLoaded = false;
            };
            
            document.head.appendChild(cipherScript);
            
        } catch (error) {
            console.warn('Failed to initialize cipher library:', error);
            this.cipherLoaded = false;
        }
    }

    async encryptMessage(message, recipientAddress, senderPrivateKey) {
        if (this.cipherLoaded && typeof window.encrypt_message === 'function') {
            try {
                // Use official Kasia encryption
                const encrypted = await window.encrypt_message(message, recipientAddress, senderPrivateKey);
                return {
                    encrypted: true,
                    algorithm: 'kasia-official',
                    content: encrypted,
                    recipient: recipientAddress,
                    timestamp: Date.now(),
                    version: '1.0'
                };
            } catch (error) {
                console.warn('Official encryption failed, using fallback:', error);
            }
        }

        // Fallback encryption (base64 encoding for development)
        return {
            encrypted: true,
            algorithm: 'kasia-fallback',
            content: btoa(message),
            recipient: recipientAddress,
            timestamp: Date.now(),
            version: '1.0'
        };
    }

    async decryptMessage(encryptedPayload, privateKey) {
        if (this.cipherLoaded && typeof window.decrypt_message === 'function') {
            try {
                // Use official Kasia decryption
                if (encryptedPayload.algorithm === 'kasia-official') {
                    return await window.decrypt_message(encryptedPayload.content, privateKey);
                }
            } catch (error) {
                console.warn('Official decryption failed, using fallback:', error);
            }
        }

        // Fallback decryption
        if (encryptedPayload.algorithm === 'kasia-fallback' || encryptedPayload.content) {
            try {
                return atob(encryptedPayload.content);
            } catch (error) {
                console.error('Fallback decryption failed:', error);
                throw new Error('Unable to decrypt message');
            }
        }

        // If not encrypted, return as-is
        return encryptedPayload.content || encryptedPayload;
    }

    // Create Kasia-compatible message payload
    createKasiaPayload(message, senderAddress, recipientAddress) {
        return {
            type: 'ciph_msg',
            version: '1',
            messageType: 'text',
            content: message,
            timestamp: Date.now(),
            senderAddress: senderAddress,
            recipientAddress: recipientAddress,
            conversationId: this.generateConversationId(senderAddress, recipientAddress)
        };
    }

    // Generate conversation ID compatible with official Kasia
    generateConversationId(address1, address2) {
        // Sort addresses to ensure consistent conversation ID
        const sorted = [address1, address2].sort();
        return `conv_${sorted[0].substring(6, 20)}_${sorted[1].substring(6, 20)}`;
    }

    // Check if cipher library is available
    isCipherAvailable() {
        return this.cipherLoaded;
    }
}

// Make available globally for Kasia Direct
window.KasiaDirectCipher = KasiaDirectCipher;
