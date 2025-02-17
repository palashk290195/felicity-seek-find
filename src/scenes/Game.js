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
        this.ctaText = null;
    }

    create() {
        console.log('[Game][create] Initializing');
        this.cameras.main.setBackgroundColor('#ffffff');

        const cleanup = AudioUtils.setup(this);
        this.events.once('shutdown', cleanup);
        
        // Start background music
        AudioUtils.playSound(this, 'seek_bg_music', true, { loop: true });
        
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
        //this.scale.on('resize', this.handleResize, this);
    }

    setupCtaButtons() {
        if (this['cta']) {
            this['cta'].setInteractive();
            this['cta'].on('pointerdown', () => {
                adRetry();
                handleCtaPressed();
            });
            
            // Add CTA text
            this.addCtaText(this['cta']);
        }


    }

    addCtaText(ctaButton) {
        // Create text object if it doesn't exist
        if (!this.ctaText) {
            this.ctaText = this.add.text(0, 0, '', {
                fontFamily: 'Arial',
                fontSize: '32px',
                color: '#000000'
            });

            // Add text to main container if it exists
            const staticContainer = this['static-container'];
            if (staticContainer) {
                staticContainer.add(this.ctaText);
            }
        }
        // Get current language text
        const languageConfig = getCurrentLanguage();
        const ctaText = languageConfig.game_cta;

        // Create a container for sizing
        const textContainer = {
            width: ctaButton.displayWidth * 0.5,
            height: ctaButton.displayHeight * 0.5
        };

        // Fit text to container
        fitTextToContainer(this.ctaText, textContainer, ctaText);
        this.ctaText.setPosition(ctaButton.x, ctaButton.y);
    }

    handleResize(gameSize) {
        // First update the layout
        this.tweens.killAll();
        
        // Update layout with modified positions
        this.layoutManager.updateLayout();

        // Reposition shelf and find-key-1 based on new dimensions
        const shelf = this['shelf'];
        const findKey1 = this['find-key-1'];
        
        if (shelf || findKey1) {
            const moveDistance = GAME_CONFIG.animation.shelfMoveDistance;
            const isLandscape = this.scale.width > this.scale.height;
            // Only apply aspect ratio adjustment in landscape mode
            const aspectRatioAdjustment = isLandscape ? Math.min(this.scale.width, this.scale.height) / Math.max(this.scale.width, this.scale.height) : 1;
            const pixelMoveDistance = Math.min(this.scale.width, this.scale.height) * moveDistance * aspectRatioAdjustment;

            // Reposition shelf if it exists
            if (shelf) {
                const shelfAsset = GAME_LAYOUT.containers['main-container'].assets['ceb4810a-354f-44fd-ba1e-267dbd7a0d31'];
                const originalX = isLandscape ? shelfAsset.landscape.position.x : shelfAsset.portrait.position.x;
                const containerWidth = this.scale.width;
                shelf.x = (originalX - moveDistance * aspectRatioAdjustment) * containerWidth;
            }

            // Reposition find-key-1 if it exists and not destroyed
            if (findKey1 && findKey1.visible) {
                findKey1.x = shelf ? shelf.x : findKey1.x - pixelMoveDistance;
            }
        }
        
        // Clear object interaction manager's internal arrays
        // but don't destroy the cats - they were just repositioned by layout manager
        if (this.objectInteractionManager) {
            this.objectInteractionManager.cleanup();
            // Re-setup cats - this will only setup non-destroyed cats
            this.objectInteractionManager.setupKeys();
        }

        // Handle resize in game state manager - this handles win state animations
        if (this.gameStateManager) {
            this.gameStateManager.handleResize();
        }

        // Update CTA text position and size
        const ctaButton = this['cta'];
        if (ctaButton && this.ctaText) {
            const textContainer = {
                width: ctaButton.displayWidth * 0.5,
                height: ctaButton.displayHeight * 0.5
            };
            
            fitTextToContainer(this.ctaText, textContainer, this.ctaText.text);
            this.ctaText.setPosition(ctaButton.x, ctaButton.y);
        }
    }
}