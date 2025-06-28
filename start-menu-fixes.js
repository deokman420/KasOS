/**
 * Start Menu Fixes
 * This script fixes issues with the start menu functionality
 */

// Run this when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('⚡ Start menu fixes loaded');
    
    // Get the required elements
    const startButton = document.getElementById('startButton');
    const startMenu = document.getElementById('startMenu');
    
    if (!startButton) {
        console.error('❌ Start button not found');
        return;
    }
    
    if (!startMenu) {
        console.error('❌ Start menu not found');
        return;
    }
    
    // Make sure the start menu has the hidden class initially
    if (!startMenu.classList.contains('hidden')) {
        startMenu.classList.add('hidden');
    }
    
    console.log('✅ Start menu elements found and initialized');
    
    // Remove existing event listeners from start button to prevent conflicts
    startButton.removeEventListener('click', startButtonHandler);
    startButton.onclick = null;
    
    // Define our handler function
    function startButtonHandler(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        if (startMenu.classList.contains('hidden')) {
            // Open menu
            startMenu.classList.remove('hidden');
            startMenu.classList.add('show');
            
            // Focus the search if available
            const appSearch = document.getElementById('appSearch');
            if (appSearch) {
                setTimeout(() => appSearch.focus(), 100);
            }
        } else {
            // Close menu
            startMenu.classList.add('hidden');
            startMenu.classList.remove('show');
        }
    }
    
    // Create a direct and simple click handler for the start button
    startButton.onclick = startButtonHandler;
    
    // Also add it via addEventListener to be sure
    startButton.addEventListener('click', startButtonHandler);
    
    // Replace the global function to toggle the start menu
    window.toggleStartMenu = function() {
        console.log('🔄 Toggle start menu called');
        startButtonHandler();
        return true;
    };
    
    console.log('✅ Start menu fixed handlers attached');
});

// If we're loaded after DOMContentLoaded, run immediately
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('🚀 Start menu fixes running immediately');
    setTimeout(function() {
        var event = document.createEvent('Event');
        event.initEvent('DOMContentLoaded', true, true);
        document.dispatchEvent(event);
    }, 0);
}