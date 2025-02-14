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
        this.modifiedLayout = null;
    }

    create() {
        console.log('[Game][create] Initializing');
        this.cameras.main.setBackgroundColor('#ffffff');

        const cleanup = AudioUtils.setup(this);
        this.events.once('shutdown', cleanup);
        
        // Create modified layout with updated shelf position
        this.modifiedLayout = JSON.parse(JSON.stringify(GAME_LAYOUT));
        const shelfAsset = this.modifiedLayout.containers['main-container'].assets['ceb4810a-354f-44fd-ba1e-267dbd7a0d31'];
        const moveDistance = GAME_CONFIG.animation.shelfMoveDistance;
        
        // Update shelf position in both orientations
        const originalPortraitX = shelfAsset.portrait.position.x;
        const originalLandscapeX = shelfAsset.landscape.position.x;
        const aspectRatio = Math.min(this.scale.width, this.scale.height) / Math.max(this.scale.width, this.scale.height);
        shelfAsset.portrait.position.x = originalPortraitX - moveDistance * aspectRatio;
        shelfAsset.landscape.position.x = originalLandscapeX - moveDistance * aspectRatio;
        
        // Use original layout initially
        this.layoutManager = new LayoutManager(this, GAME_LAYOUT);

        // Initialize game state manager first
        this.gameStateManager = new GameStateManager(this);

        // Initialize object interaction manager with game state manager
        this.objectInteractionManager = new ObjectInteractionManager(this, this.gameStateManager);

        // Animate shelf and find-key-1 to the left
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;
        const pixelMoveDistance = Math.min(gameWidth, gameHeight) * GAME_CONFIG.animation.shelfMoveDistance;

        // Get the game objects
        const shelf = this['shelf'];
        const findKey1 = this['find-key-1'];

        if (shelf && findKey1) {
            // Store initial positions
            const initialShelfX = shelf.x;
            const initialFindKey1X = findKey1.x;

            // Create tween for both objects
            this.tweens.add({
                targets: [shelf, findKey1],
                x: function (target) {
                    return target === shelf ? initialShelfX - pixelMoveDistance : initialFindKey1X - pixelMoveDistance;
                },
                duration: 1000,
                ease: 'Power1',
                onComplete: () => {
                    // Get all locks
                    const lock1 = this['lock1'];
                    const lock2 = this['lock2'];
                    const lock3 = this['lock3'];
                    const lock4 = this['lock4'];

                    // Function to create scale tween for a lock
                    const createLockTween = (lock, nextLock) => {
                        this.tweens.add({
                            targets: lock,
                            scaleX: lock.scaleX * 1.2,
                            scaleY: lock.scaleY * 1.2,
                            duration: 200,
                            yoyo: true,
                            ease: 'Quad.easeOut',
                            onComplete: () => {
                                if (nextLock) {
                                    createLockTween(nextLock, nextLock === lock2 ? lock3 : nextLock === lock3 ? lock4 : null);
                                } else {
                                    // Last lock animation completed
                                    // Make pointer visible
                                    const pointer = this['pointer'];
                                    if (pointer) {
                                        pointer.setVisible(true);
                                    }

                                    // Get main container
                                    const mainContainer = this['main-container'];
                                    if (mainContainer) {
                                        const isPortrait = this.scale.height > this.scale.width;
                                        const shakeDistance = Math.min(this.scale.width, this.scale.height) * GAME_CONFIG.animation.containerShakeDistance;

                                        // Create container shake tween
                                        this.tweens.add({
                                            targets: mainContainer,
                                            [isPortrait ? 'x' : 'y']: mainContainer[isPortrait ? 'x' : 'y'] - shakeDistance,
                                            duration: 500,
                                            yoyo: true,
                                            ease: 'Quad.easeInOut',
                                            onComplete: () => {
                                                // Hide pointer after shake completes
                                                const pointer = this['pointer'];
                                                if (pointer) {
                                                    pointer.setVisible(false);
                                                }
                                                
                                                // Setup keys and container interaction
                                                if (this.objectInteractionManager) {
                                                    this.objectInteractionManager.setupKeysAndContainer();
                                                }
                                            }
                                        });
                                    }
                                }
                            }
                        });
                    };

                    // Start the chain with lock1
                    createLockTween(lock1, lock2);
                }
            });
        }

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
        
        // Update layout with modified positions
        this.layoutManager = new LayoutManager(this, this.modifiedLayout);
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