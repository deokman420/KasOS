/**
 * KasOS Wallpapers Collection
 * Tailwind CSS-inspired background styles
 */

const KasOSWallpapers = [
    {
        id: 'animated-gradient',
        name: 'Animated Gradient',
        category: 'animated',
        thumbnail: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #6B8DD6 100%)',
        css: `background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
              background-size: 400% 400%;
              animation: KasOS-gradient-animation 15s ease infinite;`
    },
    {
        id: 'default',
        name: 'Default Blue',
        category: 'gradient',
        thumbnail: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        css: 'background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);'
    },
    {
        id: 'purple-dream',
        name: 'Purple Dream',
        category: 'gradient',
        thumbnail: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        css: 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);'
    },
    {
        id: 'sunset',
        name: 'Sunset',
        category: 'gradient',
        thumbnail: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
        css: 'background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);'
    },
    {
        id: 'cool-blues',
        name: 'Cool Blues',
        category: 'gradient',
        thumbnail: 'linear-gradient(135deg, #2980b9 0%, #6dd5fa 100%)',
        css: 'background: linear-gradient(135deg, #2980b9 0%, #6dd5fa 100%);'
    },
    {
        id: 'emerald',
        name: 'Emerald',
        category: 'gradient',
        thumbnail: 'linear-gradient(135deg, #43a047 0%, #1de9b6 100%)',
        css: 'background: linear-gradient(135deg, #43a047 0%, #1de9b6 100%);'
    },
    {
        id: 'dark-ocean',
        name: 'Dark Ocean',
        category: 'gradient',
        thumbnail: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        css: 'background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);'
    },
    {
        id: 'cherry-blossom',
        name: 'Cherry Blossom',
        category: 'gradient',
        thumbnail: 'linear-gradient(135deg, #feb2b2 0%, #9f7aea 100%)',
        css: 'background: linear-gradient(135deg, #feb2b2 0%, #9f7aea 100%);'
    },
    {
        id: 'cosmic-fusion',
        name: 'Cosmic Fusion',
        category: 'gradient',
        thumbnail: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)',
        css: 'background: linear-gradient(135deg, #ff0844 0%, #ffb199 100%);'
    },
    {
        id: 'deep-sea',
        name: 'Deep Sea',
        category: 'gradient',
        thumbnail: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        css: 'background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);'
    },
    {
        id: 'midnight',
        name: 'Midnight',
        category: 'gradient',
        thumbnail: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
        css: 'background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);'
    },
    {
        id: 'radial-blue',
        name: 'Radial Blue',
        category: 'radial',
        thumbnail: 'radial-gradient(circle, #1a2980 0%, #26d0ce 100%)',
        css: 'background: radial-gradient(circle, #1a2980 0%, #26d0ce 100%);'
    },
    {
        id: 'radial-purple',
        name: 'Radial Purple',
        category: 'radial',
        thumbnail: 'radial-gradient(circle, #764ba2 0%, #667eea 100%)',
        css: 'background: radial-gradient(circle, #764ba2 0%, #667eea 100%);'
    },
    {
        id: 'dots',
        name: 'Dots Pattern',
        category: 'pattern',
        thumbnail: '#2d3748',
        css: `background-color: #2d3748;
              background-image: radial-gradient(#4a5568 1px, transparent 1px);
              background-size: 20px 20px;`
    },
    {
        id: 'carbon',
        name: 'Carbon',
        category: 'pattern',
        thumbnail: '#222',
        css: `background-color: #222;
              background-image: linear-gradient(45deg, #333 25%, transparent 25%, transparent 75%, #333 75%, #333),
                                linear-gradient(45deg, #333 25%, transparent 25%, transparent 75%, #333 75%, #333);
              background-size: 20px 20px;
              background-position: 0 0, 10px 10px;`
    },
    {
        id: 'stripes',
        name: 'Diagonal Stripes',
        category: 'pattern',
        thumbnail: '#3182ce',
        css: `background: #3182ce;
              background-image: linear-gradient(135deg, rgba(255,255,255,.15) 25%, transparent 25%,
                                transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%,
                                transparent 75%, transparent);
              background-size: 20px 20px;`
    },
    {
        id: 'pulse',
        name: 'Pulse',
        category: 'animated',
        thumbnail: '#4a5568',
        css: `background: #4a5568;
              animation: KasOS-pulse-animation 10s infinite;`
    },
    {
        id: 'animated-sunset',
        name: 'Animated Sunset',
        category: 'animated',
        thumbnail: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)',
        css: `background: linear-gradient(270deg, #f6d365, #fda085, #f6d365);
              background-size: 600% 600%;
              animation: KasOS-animated-sunset 12s ease-in-out infinite;`
    },
    {
        id: 'animated-ocean',
        name: 'Animated Ocean',
        category: 'animated',
        thumbnail: 'linear-gradient(120deg, #2193b0 0%, #6dd5ed 100%)',
        css: `background: linear-gradient(270deg, #2193b0, #6dd5ed, #2193b0);
              background-size: 500% 500%;
              animation: KasOS-animated-ocean 14s linear infinite;`
    },
    {
        id: 'animated-mint',
        name: 'Animated Mint',
        category: 'animated',
        thumbnail: 'linear-gradient(120deg, #a8ff78 0%, #78ffd6 100%)',
        css: `background: linear-gradient(270deg, #a8ff78, #78ffd6, #a8ff78);
              background-size: 400% 400%;
              animation: KasOS-animated-mint 10s ease-in-out infinite;`
    },
    {
        id: 'animated-fire',
        name: 'Animated Fire',
        category: 'animated',
        thumbnail: 'linear-gradient(120deg, #ff512f 0%, #dd2476 100%)',
        css: `background: linear-gradient(270deg, #ff512f, #dd2476, #ff512f);
              background-size: 400% 400%;
              animation: KasOS-animated-fire 8s linear infinite;`
    },
    {
        id: 'animated-candy',
        name: 'Animated Candy',
        category: 'animated',
        thumbnail: 'linear-gradient(120deg, #f7971e 0%, #ffd200 100%)',
        css: `background: linear-gradient(270deg, #f7971e, #ffd200, #f7971e);
              background-size: 400% 400%;
              animation: KasOS-animated-candy 11s ease-in-out infinite;`
    },
    {
        id: 'animated-aurora',
        name: 'Animated Aurora',
        category: 'animated',
        thumbnail: 'linear-gradient(120deg, #00c3ff 0%, #ffff1c 100%)',
        css: `background: linear-gradient(270deg, #00c3ff, #ffff1c, #00c3ff);
              background-size: 400% 400%;
              animation: KasOS-animated-aurora 13s ease-in-out infinite;`
    },
    {
        id: 'animated-forest',
        name: 'Animated Forest',
        category: 'animated',
        thumbnail: 'linear-gradient(120deg, #11998e 0%, #38ef7d 100%)',
        css: `background: linear-gradient(270deg, #11998e, #38ef7d, #11998e);
              background-size: 400% 400%;
              animation: KasOS-animated-forest 9s linear infinite;`
    },
    {
        id: 'animated-peach',
        name: 'Animated Peach',
        category: 'animated',
        thumbnail: 'linear-gradient(120deg, #ffecd2 0%, #fcb69f 100%)',
        css: `background: linear-gradient(270deg, #ffecd2, #fcb69f, #ffecd2);
              background-size: 400% 400%;
              animation: KasOS-animated-peach 12s ease-in-out infinite;`
    },
    {
        id: 'animated-space',
        name: 'Animated Space',
        category: 'animated',
        thumbnail: 'linear-gradient(120deg, #434343 0%, #262626 100%)',
        css: `background: linear-gradient(270deg, #434343, #262626, #434343);
              background-size: 400% 400%;
              animation: KasOS-animated-space 15s linear infinite;`
    },
    {
        id: 'animated-ice',
        name: 'Animated Ice',
        category: 'animated',
        thumbnail: 'linear-gradient(120deg, #83a4d4 0%, #b6fbff 100%)',
        css: `background: linear-gradient(270deg, #83a4d4, #b6fbff, #83a4d4);
              background-size: 400% 400%;
              animation: KasOS-animated-ice 10s ease-in-out infinite;`
    },
    {
        id: 'animated-lava',
        name: 'Animated Lava',
        category: 'animated',
        thumbnail: 'linear-gradient(120deg, #ff512f 0%, #f09819 100%)',
        css: `background: linear-gradient(270deg, #ff512f, #f09819, #ff512f);
              background-size: 400% 400%;
              animation: KasOS-animated-lava 7s linear infinite;`
    },
    {
        id: 'animated-blossom',
        name: 'Animated Blossom',
        category: 'animated',
        thumbnail: 'linear-gradient(120deg, #ffafbd 0%, #ffc3a0 100%)',
        css: `background: linear-gradient(270deg, #ffafbd, #ffc3a0, #ffafbd);
              background-size: 400% 400%;
              animation: KasOS-animated-blossom 13s ease-in-out infinite;`
    },
    {
        id: 'animated-indigo',
        name: 'Animated Indigo',
        category: 'animated',
        thumbnail: 'linear-gradient(120deg, #4e54c8 0%, #8f94fb 100%)',
        css: `background: linear-gradient(270deg, #4e54c8, #8f94fb, #4e54c8);
              background-size: 400% 400%;
              animation: KasOS-animated-indigo 11s linear infinite;`
    },
    {
        id: 'animated-coral',
        name: 'Animated Coral',
        category: 'animated',
        thumbnail: 'linear-gradient(120deg, #ff9966 0%, #ff5e62 100%)',
        css: `background: linear-gradient(270deg, #ff9966, #ff5e62, #ff9966);
              background-size: 400% 400%;
              animation: KasOS-animated-coral 9s ease-in-out infinite;`
    },
    {
        id: 'animated-neon',
        name: 'Animated Neon',
        category: 'animated',
        thumbnail: 'linear-gradient(120deg, #00f2fe 0%, #4facfe 100%)',
        css: `background: linear-gradient(270deg, #00f2fe, #4facfe, #00f2fe);
              background-size: 400% 400%;
              animation: KasOS-animated-neon 8s linear infinite;`
    },
    {
        id: 'animated-mango',
        name: 'Animated Mango',
        category: 'animated',
        thumbnail: 'linear-gradient(120deg, #ffe259 0%, #ffa751 100%)',
        css: `background: linear-gradient(270deg, #ffe259, #ffa751, #ffe259);
              background-size: 400% 400%;
              animation: KasOS-animated-mango 12s ease-in-out infinite;`
    },
    // Additional wallpapers for more variety
    {
        id: 'autumn-leaves',
        name: 'Autumn Leaves',
        category: 'gradient',
        thumbnail: 'linear-gradient(135deg, #d38312 0%, #f8a45c 100%)',
        css: 'background: linear-gradient(135deg, #d38312 0%, #f8a45c 100%);'
    },
    {
        id: 'royal-purple',
        name: 'Royal Purple',
        category: 'gradient',
        thumbnail: 'linear-gradient(135deg, #667db6 0%, #0082c8 50%, #0082c8 100%)',
        css: 'background: linear-gradient(135deg, #667db6 0%, #0082c8 50%, #0082c8 100%);'
    },
    {
        id: 'tropical',
        name: 'Tropical',
        category: 'gradient',
        thumbnail: 'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)',
        css: 'background: linear-gradient(135deg, #0ba360 0%, #3cba92 100%);'
    },
    {
        id: 'sunrise-orange',
        name: 'Sunrise Orange',
        category: 'gradient',
        thumbnail: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
        css: 'background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);'
    },
    {
        id: 'winter-night',
        name: 'Winter Night',
        category: 'gradient',
        thumbnail: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
        css: 'background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);'
    },
    {
        id: 'spring-meadow',
        name: 'Spring Meadow',
        category: 'gradient',
        thumbnail: 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)',
        css: 'background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%);'
    },
    {
        id: 'hexagon-pattern',
        name: 'Hexagon Pattern',
        category: 'pattern',
        thumbnail: '#718096',
        css: `background-color: #718096;
              background-image: 
                radial-gradient(circle farthest-side at 0% 50%,#fb543f 23.5%,transparent 0)100% 0,
                radial-gradient(circle farthest-side at 0% 50%,#fc8c65 23.5%,transparent 0)80% 50%,
                radial-gradient(circle farthest-side at 0% 50%,#fb543f 23.5%,transparent 0)100% 100%,
                radial-gradient(circle farthest-side at 0% 50%,#fc8c65 23.5%,transparent 0)80% 150%,
                radial-gradient(circle farthest-side at 0% 50%,#fb543f 23.5%,transparent 0)100% 200%;
              background-size: 40px 60px;`
    },
    {
        id: 'wave-pattern',
        name: 'Wave Pattern',
        category: 'pattern',
        thumbnail: '#4299e1',
        css: `background-color: #4299e1;
              background-image: repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,.1) 2px, rgba(255,255,255,.1) 4px);`
    },
    {
        id: 'animated-plasma',
        name: 'Animated Plasma',
        category: 'animated',
        thumbnail: 'linear-gradient(120deg, #667eea 0%, #764ba2 100%)',
        css: `background: linear-gradient(270deg, #667eea, #764ba2, #f093fb, #f5576c, #4facfe, #667eea);
              background-size: 1200% 1200%;
              animation: KasOS-animated-plasma 20s ease infinite;`
    },
    {
        id: 'animated-rainbow',
        name: 'Animated Rainbow',
        category: 'animated',
        thumbnail: 'linear-gradient(120deg, #ff0844 0%, #ffb199 50%, #00f2fe 100%)',
        css: `background: linear-gradient(270deg, #ff0844, #ffb199, #00f2fe, #4facfe, #f093fb, #ff0844);
              background-size: 1200% 1200%;
              animation: KasOS-animated-rainbow 25s linear infinite;`
    }
];

// Ensure wallpapers are available globally
window.KasOSWallpapers = KasOSWallpapers;

// --- Shuffle animated wallpapers for random order ---
(function() {
    const animated = KasOSWallpapers.filter(w => w.category === 'animated');
    for (let i = animated.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [animated[i], animated[j]] = [animated[j], animated[i]];
    }
    let idx = 0;
    KasOSWallpapers.forEach((w, i) => {
        if (w.category === 'animated') {
            KasOSWallpapers[i] = animated[idx++];
        }
    });
})();

// Ensure wallpapers are still available globally after shuffle
window.KasOSWallpapers = KasOSWallpapers;

// Add animation keyframes to document when this script loads
(function() {
    if (!document.querySelector('#KasOS-wallpaper-animations')) {
        const styleEl = document.createElement('style');
        styleEl.id = 'KasOS-wallpaper-animations';
        styleEl.textContent = `
            @keyframes KasOS-gradient-animation {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            
            @keyframes KasOS-pulse-animation {
                0% { background-color: #4a5568; }
                50% { background-color: #2d3748; }
                100% { background-color: #4a5568; }
            }
            @keyframes KasOS-animated-sunset {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            @keyframes KasOS-animated-ocean {
                0% { background-position: 100% 0%; }
                50% { background-position: 0% 100%; }
                100% { background-position: 100% 0%; }
            }
            @keyframes KasOS-animated-mint {
                0% { background-position: 0% 0%; }
                50% { background-position: 100% 100%; }
                100% { background-position: 0% 0%; }
            }
            @keyframes KasOS-animated-fire {
                0% { background-position: 0% 100%; }
                50% { background-position: 100% 0%; }
                100% { background-position: 0% 100%; }
            }
            @keyframes KasOS-animated-candy {
                0% { background-position: 50% 0%; }
                50% { background-position: 50% 100%; }
                100% { background-position: 50% 0%; }
            }
            @keyframes KasOS-animated-aurora {
                0% { background-position: 0% 0%; }
                50% { background-position: 100% 100%; }
                100% { background-position: 0% 0%; }
            }
            @keyframes KasOS-animated-forest {
                0% { background-position: 100% 100%; }
                50% { background-position: 0% 0%; }
                100% { background-position: 100% 100%; }
            }
            @keyframes KasOS-animated-peach {
                0% { background-position: 0% 100%; }
                50% { background-position: 100% 0%; }
                100% { background-position: 0% 100%; }
            }
            @keyframes KasOS-animated-space {
                0% { background-position: 0% 0%; }
                50% { background-position: 100% 100%; }
                100% { background-position: 0% 0%; }
            }
            @keyframes KasOS-animated-ice {
                0% { background-position: 100% 0%; }
                50% { background-position: 0% 100%; }
                100% { background-position: 100% 0%; }
            }
            @keyframes KasOS-animated-lava {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            @keyframes KasOS-animated-blossom {
                0% { background-position: 50% 0%; }
                50% { background-position: 50% 100%; }
                100% { background-position: 50% 0%; }
            }
            @keyframes KasOS-animated-indigo {
                0% { background-position: 0% 0%; }
                50% { background-position: 100% 100%; }
                100% { background-position: 0% 0%; }
            }
            @keyframes KasOS-animated-coral {
                0% { background-position: 100% 100%; }
                50% { background-position: 0% 0%; }
                100% { background-position: 100% 100%; }
            }
            @keyframes KasOS-animated-neon {
                0% { background-position: 0% 100%; }
                50% { background-position: 100% 0%; }
                100% { background-position: 0% 100%; }
            }
            @keyframes KasOS-animated-mango {
                0% { background-position: 0% 0%; }
                50% { background-position: 100% 100%; }
                100% { background-position: 0% 0%; }
            }
            @keyframes KasOS-animated-plasma {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            @keyframes KasOS-animated-rainbow {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            @keyframes KasOS-animated-plasma {
                0% { background-position: 0% 0%; }
                50% { background-position: 100% 100%; }
                100% { background-position: 0% 0%; }
            }
            @keyframes KasOS-animated-rainbow {
                0% { background-position: 0% 0%; }
                50% { background-position: 100% 100%; }
                100% { background-position: 0% 0%; }
            }
        `;
        document.head.appendChild(styleEl);
    }
})();

// Function to apply wallpaper to desktop
function applyWallpaper(wallpaperId) {
    const wallpaper = KasOSWallpapers.find(w => w.id === wallpaperId) || KasOSWallpapers[0];
    
    // Remove existing wallpaper animations 
    document.querySelectorAll('.desktop').forEach(desktop => {
        desktop.setAttribute('style', wallpaper.css);
    });
    
    // Also apply to body for consistency
    document.body.style.background = '';
    document.body.style.backgroundImage = '';
    document.body.style.cssText += wallpaper.css;
    
    // Save to localStorage with consistent key
    localStorage.setItem('KasOS-wallpaper', wallpaperId);
    localStorage.setItem('KasOS-wallpaper-id', wallpaperId);
    
    return wallpaper;
}

// Function to initialize wallpaper from localStorage
function initWallpaper() {
    const savedWallpaperId = localStorage.getItem('KasOS-wallpaper') || 
                            localStorage.getItem('KasOS-wallpaper-id') || 
                            'animated-gradient'; // Default to animated gradient
    applyWallpaper(savedWallpaperId);
}

// Initialize wallpaper when the DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWallpaper);
} else {
    initWallpaper();
}
