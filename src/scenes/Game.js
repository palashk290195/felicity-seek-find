// Game.js
import * as Phaser from '../phaser/phaser-3.87.0-core.js';
import { handleCtaPressed, networkPlugin, adStart, adEnd, adRetry } from "../networkPlugin.js";
import { config } from "../config.js";
import { ObjectInteractionManager } from "../managers/object-interaction-manager.js";
import { GameStateManager } from "../managers/game-state-manager.js";
import { GAME_CONFIG, getCurrentLanguage } from "./utils/game-config.js";
import { fitImageToContainer, fitTextToContainer } from "./utils/layout-utils.js";
import { AudioUtils } from '../utils/audio-utils.js';
import { LayoutManager } from './utils/layout-manager.js';
import { GAME_LAYOUT } from '../config/game-layout.js';
import { ImageFitter } from './utils/image-fitter.js';

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
        this.layoutManager = null;
        this.objectInteractionManager = null;
        this.gameStateManager = null;
    }

    create() {
        console.log('[Game][create] Initializing');
        this.cameras.main.setBackgroundColor('#ffffff');

        const cleanup = AudioUtils.setup(this);
        this.events.once('shutdown', cleanup);
        this.layoutManager = new LayoutManager(this, GAME_LAYOUT);

        // Initialize game state manager first
        this.gameStateManager = new GameStateManager(this);

        // Initialize object interaction manager with game state manager
        this.objectInteractionManager = new ObjectInteractionManager(this, this.gameStateManager);

        // Make download and play-now assets interactive
        this.setupCtaButtons();

        // Handle resize
        this.scale.on('resize', this.handleResize, this);
    }

    setupCtaButtons() {
        if (this['download']) {
            this['download'].setInteractive();
            this['download'].on('pointerdown', () => {
                adRetry();
                handleCtaPressed();
            });
        }

        if (this['play-now']) {
            this['play-now'].setInteractive();
            this['play-now'].on('pointerdown', () => {
                adRetry();
                handleCtaPressed();
            });
        }
    }

    handleResize() {
        // First update the layout
        this.tweens.killAll();
        
        // Update layout - this will reposition all existing game objects
        this.layoutManager.updateLayout();
        
        // Clear object interaction manager's internal arrays
        // but don't destroy the cats - they were just repositioned by layout manager
        if (this.objectInteractionManager) {
            this.objectInteractionManager.cleanup();
            // Re-setup cats - this will only setup non-destroyed cats
            this.objectInteractionManager.setupCats();
        }

        // Handle resize in game state manager - this handles win state animations
        if (this.gameStateManager) {
            this.gameStateManager.handleResize();
        }
    }
}