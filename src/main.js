// main.js
import * as Phaser from './phaser/phaser-3.87.0-core.js';
import { mraidAdNetworks, networkPlugin } from './networkPlugin.js';
import { Game } from './scenes/Game';
import { Preloader } from './scenes/Preloader';
import { config } from './config.js';
import { EndCard } from "./scenes/EndCard";
import { MidCard } from "./scenes/MidCard";
import { StartCard } from './scenes/StartCard';

// Enhanced debug logging utility with orientation info
const logGameDimensions = (game, event = 'default') => {
    const orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    console.log(`[Game Dimensions][${event}]`, {
        width: game.scale.width,
        height: game.scale.height,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        deviceOrientation: orientation,
        devicePixelRatio: window.devicePixelRatio,
        isAndroid: /Android/i.test(navigator.userAgent),
        isIOS: /iPhone|iPad|iPod/i.test(navigator.userAgent)
    });
};

// Debounce function to prevent multiple rapid resize calls
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const gameConfig = {
    type: Phaser.AUTO,
    parent: 'ad-container',
    backgroundColor: "#028af8",
    audio: {
        disableWebAudio: false
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        width: window.innerWidth,
        height: window.innerHeight,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        orientation: {
            forceOrientation: false
        }
    },
    scene: [Preloader, StartCard, Game, MidCard, EndCard],
};

function initializePhaserGame() {
    const game = new Phaser.Game(gameConfig);
    let resizeTimeout;
    
    // Function to handle actual resize
    const handleResize = () => {
        console.log('[Window Resize Event]', {
            newWidth: window.innerWidth,
            newHeight: window.innerHeight
        });
        
        // Force a refresh of the game scale
        game.scale.refresh();
        
        // Log dimensions after resize
        logGameDimensions(game, 'resize');
    };

    // Debounced resize handler
    const debouncedResize = debounce(handleResize, 250);
    
    // Handle orientation change specifically
    const handleOrientationChange = () => {
        console.log('[Orientation Change Event]');
        
        // Clear any pending resize timeout
        clearTimeout(resizeTimeout);
        
        // Wait for the viewport to settle
        resizeTimeout = setTimeout(() => {
            // Force game scale update
            game.scale.refresh();
            
            // Update game size explicitly
            game.scale.resize(window.innerWidth, window.innerHeight);
            
            // Log dimensions after orientation change
            logGameDimensions(game, 'orientation');
            
            // Force scene resize
            const currentScene = game.scene.getScenes(true)[0];
            if (currentScene && currentScene.handleResize) {
                const gameSize = {
                    width: window.innerWidth,
                    height: window.innerHeight
                };
                currentScene.handleResize(gameSize);
            }
        }, 100); // Delay to allow viewport to settle
    };

    // Add event listeners
    window.addEventListener('resize', debouncedResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Initial dimensions log
    console.log('[Game Initialization]');
    logGameDimensions(game, 'init');
    
    // Setup cleanup
    game.events.on('destroy', () => {
        window.removeEventListener('resize', debouncedResize);
        window.removeEventListener('orientationchange', handleOrientationChange);
        clearTimeout(resizeTimeout);
    });

    return game;
}

function setupGameInitialization(adNetworkType) {
    const game = initializePhaserGame();

    if (mraidAdNetworks.has(adNetworkType)) {
        networkPlugin.initMraid(() => game);
    } else {
        return game;
    }
}

setupGameInitialization(config.adNetworkType);