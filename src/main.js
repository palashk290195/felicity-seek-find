// main.js
import * as Phaser from './phaser/phaser-3.87.0-core.js';
import { mraidAdNetworks, networkPlugin } from './networkPlugin.js';
import { Game } from './scenes/Game';
import { Preloader } from './scenes/Preloader';
import { config } from './config.js';
import { EndCard } from "./scenes/EndCard";
import { MidCard } from "./scenes/MidCard";
import { StartCard } from './scenes/StartCard';
import { GAME_CONFIG } from './scenes/utils/game-config.js';
//import { Boot } from './scenes/Boot';

// Helper function to log game dimensions for debugging
const logGameDimensions = (game, event = 'default') => {
    const orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    console.log(`[Game Dimensions][${event}]`, {
        width: game.scale.width,
        height: game.scale.height,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        deviceOrientation: orientation
    });
};

// Helper function to prevent rapid-fire resize events
const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

// Basic game configuration
const gameConfig = {
    type: Phaser.AUTO,
    parent: 'ad-container',
    backgroundColor: "#028af8",
    audio: { disableWebAudio: false },
    scale: {
        mode: Phaser.Scale.ENVELOPE,
        width: Math.max(window.innerWidth * GAME_CONFIG.display.dpi, GAME_CONFIG.display.minDimensions.width),
        height: Math.max(window.innerHeight * GAME_CONFIG.display.dpi, GAME_CONFIG.display.minDimensions.height),
        autoCenter: Phaser.Scale.CENTER_BOTH,
        orientation: { forceOrientation: false }
    },
    scene: [Preloader, StartCard, Game, MidCard, EndCard]
};

// Main function to initialize the Phaser game
function initializePhaserGame() {
    // Clean up existing game if any
    if (window.game) {
        window.game.destroy(true);
        window.game = null;
    }

    return new Promise((resolve) => {
        // Main game creation function
        function createGame() {
            // Set current dimensions (with minimums)
            gameConfig.scale.width = Math.max(window.innerWidth * GAME_CONFIG.display.dpi, GAME_CONFIG.display.minDimensions.width);
            gameConfig.scale.height = Math.max(window.innerHeight * GAME_CONFIG.display.dpi, GAME_CONFIG.display.minDimensions.height);

            // Create new game instance
            const game = new Phaser.Game(gameConfig);
            window.game = game;

            // Set up event handlers for resize and orientation changes
            setupGameEvents(game);
            resolve(game);
        }

        // Set up all game-related event handlers
        function setupGameEvents(game) {
            // Handle window resize
            const handleResize = () => {
                if (!game || !game.scale) return;
                
                const width = Math.max(window.innerWidth * GAME_CONFIG.display.dpi, GAME_CONFIG.display.minDimensions.width);
                const height = Math.max(window.innerHeight * GAME_CONFIG.display.dpi, GAME_CONFIG.display.minDimensions.height);
                
                game.scale.resize(width, height);
                game.scale.refresh();
                logGameDimensions(game, 'resize');
            };

            // Handle device orientation changes
            const handleOrientation = () => {
                if (!game || !game.scale) return;
                
                const width = Math.max(window.innerWidth * GAME_CONFIG.display.dpi, GAME_CONFIG.display.minDimensions.width);
                const height = Math.max(window.innerHeight * GAME_CONFIG.display.dpi, GAME_CONFIG.display.minDimensions.height);
                
                game.scale.resize(width, height);
                game.scale.refresh();
                
                // Update current scene if it has a resize handler
                const currentScene = game.scene.getScenes(true)[0];
                if (currentScene?.handleResize) {
                    currentScene.handleResize({
                        width: game.scale.width,
                        height: game.scale.height
                    });
                }
            };

            // Add event listeners with debounced resize
            const debouncedResize = debounce(handleResize, 250);
            window.addEventListener('resize', debouncedResize);
            window.addEventListener('orientationchange', handleOrientation);

            // Clean up event listeners when game is destroyed
            game.events.on('destroy', () => {
                window.removeEventListener('resize', debouncedResize);
                window.removeEventListener('orientationchange', handleOrientation);
            });
        }

        // Wait for next frame before creating game
        requestAnimationFrame(() => createGame());
    });
}

// Initialize game based on ad network type
function setupGameInitialization(adNetworkType) {
    const gamePromise = initializePhaserGame();
    
    if (mraidAdNetworks.has(adNetworkType)) {
        networkPlugin.initMraid(() => gamePromise);
    } else {
        return gamePromise;
    }
}

// Start the game
setupGameInitialization(config.adNetworkType);