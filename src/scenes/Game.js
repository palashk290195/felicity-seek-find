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
import { HintManager } from "../managers/hint-manager.js";
import { WrongClickManager } from "../managers/wrong-click-manager.js";
import { FindTextManager } from "../managers/find-text-manager.js";

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
        this.layoutManager = null;
        this.objectInteractionManager = null;
        this.gameStateManager = null;
        this.hintManager = null;
        this.wrongClickManager = null;
        this.findTextManager = null;
        this.modifiedLayout = null;
        this.ctaText = null;
    }

    create() {
        console.log('[Game][create] Initializing');
        this.cameras.main.setBackgroundColor('#ffffff');

        const cleanup = AudioUtils.setup(this);
        this.events.once('shutdown', cleanup);
        
        // Use original layout initially
        this.layoutManager = new LayoutManager(this, GAME_LAYOUT);

        // Initialize game state manager first
        this.gameStateManager = new GameStateManager(this);

        // Initialize object interaction manager with game state manager
        this.objectInteractionManager = new ObjectInteractionManager(this, this.gameStateManager);

        // Initialize hint manager after object interaction manager
        this.hintManager = new HintManager(this, this.gameStateManager);

        // Initialize wrong click manager
        this.wrongClickManager = new WrongClickManager(this);

        // Initialize find text manager after layout is set up
        const textBg = this['text-bg'];
        const mainContainer = this['main-container'];
        if (textBg && mainContainer) {
            this.findTextManager = new FindTextManager(this, textBg, mainContainer);
        }

        // Setup background click handling
        this.input.on('pointerdown', (pointer) => {
            // Only handle clicks that weren't on find objects
            if (!pointer.wasTouch && !this.gameStateManager.isAllObjectsFound()) {
                // Hide hint temporarily
                if (this.hintManager) {
                    this.hintManager.pauseHint();
                }
                
                // Show wrong click effect
                this.wrongClickManager.showWrongClick(pointer.x, pointer.y);

                // Resume hint after delay
                this.scene.time.delayedCall(
                    GAME_CONFIG.animation.hintCircle.nextObjectDelay,
                    () => {
                        if (this.hintManager) {
                            this.hintManager.resumeHint();
                        }
                    }
                );
            }
        });


    }

    handleResize(gameSize) {
        // First update the layout
        this.tweens.killAll();
        
        // Update layout with modified positions
        this.layoutManager.updateLayout();

        // Handle resize in game state manager - this handles win state animations
        if (this.gameStateManager) {
            this.gameStateManager.handleResize();
        }
        
        if (this.gameStateManager.gameState !== 'win') {
            // Clear object interaction manager's internal arrays
            // but don't destroy the find objects - they were just repositioned by layout manager
            if (this.objectInteractionManager) {
                this.objectInteractionManager.cleanup();
                // Re-setup find objects - this will only setup non-destroyed objects
                this.objectInteractionManager.setupFindObjects();
            }
            // Update find text after layout changes
            if (this.findTextManager) {
                const textBg = this['text-bg'];
                if (textBg) {
                    this.findTextManager.updateText();
                }
            }

            // Handle resize in hint manager
            if (this.hintManager) {
                this.hintManager.handleResize();
            }

            // Handle resize in wrong click manager
            if (this.wrongClickManager) {
                this.wrongClickManager.handleResize();
            }
        }

        
    }
}