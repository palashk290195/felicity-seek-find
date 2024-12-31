// main.js
import * as Phaser from './phaser/phaser-3.87.0-core.js';
import { mraidAdNetworks, networkPlugin } from './networkPlugin.js';
import { Game } from './scenes/Game';
import { Preloader } from './scenes/Preloader';
import { config } from './config.js';
import { EndCard } from "./scenes/EndCard";
import { MidCard } from "./scenes/MidCard";
import { StartCard } from './scenes/StartCard';

// Debug logging utility
const logGameDimensions = (game) => {
    console.log('[Game Dimensions]', {
        width: game.scale.width,
        height: game.scale.height,
        isPortrait: game.scale.height > game.scale.width,
        isLandscape: game.scale.width > game.scale.height,
        windowInnerWidth: window.innerWidth,
        windowInnerHeight: window.innerHeight
    });
};

const gameConfig = {
    type: Phaser.AUTO,
    parent: 'ad-container',
    backgroundColor: "#028af8",
    audio: {
        disableWebAudio: false
    },
    scale: {
        mode: Phaser.Scale.RESIZE, // Changed from FIT to RESIZE
        width: window.innerWidth,
        height: window.innerHeight,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [Preloader, StartCard, Game, MidCard, EndCard],
};

function initializePhaserGame() {
    const game = new Phaser.Game(gameConfig);
    
    // Add resize event listener
    window.addEventListener('resize', () => {
        console.log('[Window Resize Event]', {
            newWidth: window.innerWidth,
            newHeight: window.innerHeight
        });
        
        // Log game dimensions after resize
        logGameDimensions(game);
    });

    // Initial dimensions log
    console.log('[Game Initialization]');
    logGameDimensions(game);

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