/**
 * Start Menu Enhancement Script
 * Adds search functionality, animations, and interactive features to the Start Menu
 */

// The global toggleStartMenu function is now defined in start-menu-fixes.js
// This prevents conflicts between multiple definitions
console.log('ℹ️ Global toggleStartMenu function will be defined by start-menu-fixes.js');

document.addEventListener('DOMContentLoaded', function() {
    // Start Menu Search functionality
    const appSearch = document.getElementById('appSearch');
    const startApps = document.querySelectorAll('.start-app');
    const startMenu = document.getElementById('startMenu');
    const startButton = document.getElementById('startButton');
    
    console.log('Start Menu Elements:', {
        appSearch: !!appSearch,
        startAppsCount: startApps.length,
        startMenu: !!startMenu,
        startButton: !!startButton
    });
    
    if (appSearch) {
        appSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            startApps.forEach(app => {
                const appName = app.textContent.toLowerCase();
                const appCategory = app.getAttribute('data-category') ? 
                    app.getAttribute('data-category').toLowerCase() : '';
                
                // Improved search with partial matching and category search
                const isVisible = 
                    searchTerm === '' || 
                    appName.includes(searchTerm) || 
                    appCategory.includes(searchTerm);
                
                // Add highlight to matches and handle visibility
                app.style.display = isVisible ? 'block' : 'none';
                
                // Highlight matched text
                if (isVisible && searchTerm !== '') {
                    const regExp = new RegExp(searchTerm, 'gi');
                    const originalText = app.textContent;
                    app.innerHTML = originalText.replace(
                        regExp, 
                        match => `<span class="highlight">${match}</span>`
                    );
                    
                    // Add pulsing effect to show it's a match
                    app.classList.add('search-match');
                    setTimeout(() => app.classList.remove('search-match'), 1000);
                } else if (searchTerm === '') {
                    // Restore original text without highlights
                    const originalText = app.textContent;
                    app.innerHTML = originalText;
                }
            });
            
            // Show/hide section headers based on visible apps
            document.querySelectorAll('.start-menu-section').forEach(section => {
                const visibleApps = section.querySelectorAll('.start-app[style="display: flex;"]').length;
                section.style.display = visibleApps > 0 ? 'block' : 'none';
            });
        });
    }
      // Start button functionality - DISABLED in favor of start-menu-fixes.js
    if (startButton && startMenu) {
        // We now use the event handler in start-menu-fixes.js
        // This prevents multiple handlers from interfering with each other
        console.log('ℹ️ Start button handler in start-menu.js disabled (using start-menu-fixes.js instead)');
    } else {
        console.error('❌ Start button or start menu not found');
    }
    
    // Close start menu when clicking outside
    document.addEventListener('click', function(e) {
        if (startMenu && !startMenu.classList.contains('hidden') && 
            !startMenu.contains(e.target) && 
            e.target !== startButton) {
            startMenu.classList.add('hidden');
            startMenu.classList.remove('show');
        }
    });
      // Make start menu apps launch their applications
    startApps.forEach(app => {
        app.addEventListener('click', function() {
            const appName = this.getAttribute('data-app');
            // Close the start menu
            if (startMenu) {
                startMenu.classList.add('hidden');
                startMenu.classList.remove('show');
            }
            
            console.log(`🎯 Start menu launching app: ${appName}`);
            
            // Launch the application through KasOS
            if (window.KasOS && typeof window.KasOS.launchApplication === 'function') {
                window.KasOS.launchApplication(appName);
            } else {
                console.error(`❌ Cannot launch application: ${appName} - KasOS.launchApplication not available`);
                // Attempt to initialize directly from applications object if available
                if (window.applications && window.applications[appName] && typeof window.applications[appName].init === 'function') {
                    window.applications[appName].init(window.KasOS);
                }
            }
        });
    });
    
    // Add category filters at top
    const startMenuContent = document.querySelector('.start-menu-content');
    if (startMenuContent) {
        // Create category filter container
        const filterContainer = document.createElement('div');
        filterContainer.className = 'category-filters';
        
        // Get unique categories
        const categories = [...new Set(Array.from(startApps)
            .map(app => app.getAttribute('data-category')))];
        
        // Add "All" filter
        const allFilter = document.createElement('button');
        allFilter.className = 'category-filter active';
        allFilter.setAttribute('data-filter', 'all');
        allFilter.textContent = 'All';
        filterContainer.appendChild(allFilter);
        
        // Add category filters
        categories.forEach(category => {
            if (category) {
                const filter = document.createElement('button');
                filter.className = 'category-filter';
                filter.setAttribute('data-filter', category);
                filter.textContent = category.charAt(0).toUpperCase() + category.slice(1);
                filterContainer.appendChild(filter);
            }
        });
        
        // Insert filters at the top of content area
        startMenuContent.insertBefore(filterContainer, startMenuContent.firstChild);
        
        // Add filter functionality
        const filters = document.querySelectorAll('.category-filter');
        filters.forEach(filter => {
            filter.addEventListener('click', function() {
                // Update active state
                filters.forEach(f => f.classList.remove('active'));
                this.classList.add('active');
                
                const category = this.getAttribute('data-filter');
                
                // Filter apps
                startApps.forEach(app => {
                    if (category === 'all' || app.getAttribute('data-category') === category) {
                        app.style.display = 'flex';
                    } else {
                        app.style.display = 'none';
                    }
                });
                
                // Show/hide section headers
                document.querySelectorAll('.start-menu-section').forEach(section => {
                    const visibleApps = section.querySelectorAll('.start-app[style="display: flex;"]').length;
                    section.style.display = visibleApps > 0 ? 'block' : 'none';
                });
            });
        });
    }
    
    // Add subtle hover effect to start menu items
    startApps.forEach(app => {
        app.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        app.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
    
    // Filter apps based on search
    if (appSearch) {
        appSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            startApps.forEach(app => {
                const appName = app.textContent.toLowerCase();
                if (appName.includes(searchTerm)) {
                    app.style.display = '';
                } else {
                    app.style.display = 'none';
                }
            });
        });
        
        // Focus search on start menu open
        document.getElementById('startButton')?.addEventListener('click', function() {
            setTimeout(() => appSearch.focus(), 100);
        });
    }
});