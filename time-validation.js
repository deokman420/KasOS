/**
 * Time validation utilities with fallback mechanisms
 */

// Track if we've already performed the time check to prevent multiple attempts
let timeCheckPerformed = false;
let timeCheckInProgress = false;
let timeCheckCallbacks = [];

/**
 * Performs a quick time check with fallback mechanisms
 * @param {Function} callback - Function to call when check completes
 */
function quickTimeCheck(callback) {
    // If a check is already in progress, queue this callback
    if (timeCheckInProgress) {
        if (callback) timeCheckCallbacks.push(callback);
        return;
    }
    
    // If we've already performed a check, just return the result
    if (timeCheckPerformed) {
        if (callback) callback(true);
        return;
    }
    
    timeCheckInProgress = true;
    if (callback) timeCheckCallbacks.push(callback);
    
    // Set a timeout to ensure we don't hang if fetch fails
    const timeoutId = setTimeout(() => {
        console.log("Time check timed out, using local time instead");
        completeTimeCheck(true);
    }, 3000);
    
    // Try to fetch time from API
    fetch('https://worldtimeapi.org/api/timezone/UTC')
        .then(response => response.json())
        .then(data => {
            clearTimeout(timeoutId);
            completeTimeCheck(true);
        })
        .catch(error => {
            clearTimeout(timeoutId);
            console.warn("Quick time check failed, using local time instead:", error);
            completeTimeCheck(true); // Still return true so the app can continue
        });
}

/**
 * Completes the time check process and calls all queued callbacks
 * @param {boolean} result - The result of the time check
 */
function completeTimeCheck(result) {
    timeCheckPerformed = true;
    timeCheckInProgress = false;
    
    // Call all queued callbacks
    timeCheckCallbacks.forEach(cb => {
        try {
            cb(result);
        } catch (err) {
            console.error("Error in time check callback:", err);
        }
    });
    
    // Clear the queue
    timeCheckCallbacks = [];
}

// Export functions for use in other modules
window.timeValidation = {
    quickTimeCheck
};