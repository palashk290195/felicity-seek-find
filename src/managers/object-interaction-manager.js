import * as Phaser from '../phaser/phaser-3.87.0-core.js';
import { AudioUtils } from '../utils/audio-utils.js';

export class ObjectInteractionManager {
    constructor(scene, gameStateManager) {
        this.scene = scene;
        this.gameStateManager = gameStateManager;
        this.keys = [];
        this.container = this.scene['main-container'];
        this.dragListenerSet = false;
        this.setupKeys();
    }

    setupKeysAndContainer() {
        // Make container interactive and setup drag
        if (this.container && !this.dragListenerSet) {
            console.log('[ObjectInteractionManager] Setting up container drag');
            
            this.setupContainerDrag();
            this.dragListenerSet = true;
        }

        // Make all keys interactive and start their animations
        this.startKeyAnimations();
    }

    setupContainerDrag() {
        // Get background for bounds checking
        const bg = this.container.getByName('bg');
        if (!bg) {
            console.warn('[ObjectInteractionManager] Background not found');
            return;
        }

        // Make container interactive with a hit area matching background dimensions
        this.container.setInteractive(new Phaser.Geom.Rectangle(
            0,
            0,
            bg.displayWidth,
            bg.displayHeight
        ), Phaser.Geom.Rectangle.Contains);

        // Setup drag
        this.scene.input.setDraggable(this.container);
        
        // Store the drag handler so we can remove it in cleanup
        this.dragHandler = (pointer, gameObject, dragX, dragY) => {
            if (gameObject !== this.container) {
                console.log('[Drag] Wrong gameObject, expected container');
                return;
            }

            // Update the container's hit area to match current background dimensions
            this.container.input.hitArea.width = bg.displayWidth;
            this.container.input.hitArea.height = bg.displayHeight;

            // Get the actual display dimensions of the background as it fills the container
            const displayBounds = {
                width: this.scene.scale.width,
                height: this.scene.scale.height
            };

            // Calculate center position (where container should be when bg is centered)
            const centerX = displayBounds.width / 2;
            const centerY = displayBounds.height / 2;

            // Calculate bounds based on the background's display dimensions
            const leftBound = centerX - (bg.displayWidth - displayBounds.width) / 2;
            const rightBound = centerX + (bg.displayWidth - displayBounds.width) / 2;
            const topBound = centerY - (bg.displayHeight - displayBounds.height) / 2;
            const bottomBound = centerY + (bg.displayHeight - displayBounds.height) / 2;

            // Apply drag with bounds in both directions
            const newX = Phaser.Math.Clamp(dragX, leftBound, rightBound);
            const newY = Phaser.Math.Clamp(dragY, topBound, bottomBound);

            this.container.x = newX;
            this.container.y = newY;
        };

        this.scene.input.on('drag', this.dragHandler);
    }

    startKeyAnimations(currentKeyIndex = 1) {
        // If all keys are clicked, stop animations
        if (this.gameStateManager.isAllKeysClicked()) {
            return;
        }

        const key = this.scene[`find-key-${currentKeyIndex}`];
        if (!key) {
            // If current key doesn't exist, try starting from beginning
            if (currentKeyIndex === 1) {
                return; // If we're already at 1 and it doesn't exist, stop
            }
            this.startKeyAnimations(1);
            return;
        }

        // Skip if key was already clicked
        if (this.gameStateManager.isKeyClicked(currentKeyIndex)) {
            // Move to next key
            const nextKeyIndex = currentKeyIndex + 1;
            this.startKeyAnimations(nextKeyIndex > 4 ? 1 : nextKeyIndex);
            return;
        }

        // Make key interactive if it exists
        key.setInteractive();

        // Create the combined scale and rotation animation
        let animationCount = 0;
        const totalAnimations = 2; // Run animation twice

        const createKeyAnimation = () => {
            // Scale up and rotate
            this.scene.tweens.add({
                targets: key,
                scaleX: key.scaleX * 1.2,
                scaleY: key.scaleY * 1.2,
                angle: '+=45',
                duration: 300,
                yoyo: true,
                ease: 'Quad.easeOut',
                onComplete: () => {
                    animationCount++;
                    if (animationCount < totalAnimations) {
                        // Add delay before second animation of same key
                        this.scene.time.delayedCall(1000, () => {
                            createKeyAnimation();
                        });
                    } else {
                        // Add delay before starting next key
                        this.scene.time.delayedCall(1000, () => {
                            // Check again if all keys are clicked before moving to next
                            if (!this.gameStateManager.isAllKeysClicked()) {
                                const nextKeyIndex = currentKeyIndex + 1;
                                this.startKeyAnimations(nextKeyIndex > 4 ? 1 : nextKeyIndex);
                            }
                        });
                    }
                }
            });
        };

        // Start the animation for current key
        createKeyAnimation();
    }

    setupKeys() {
        // Setup all 4 keys with interaction
        for (let i = 1; i <= 4; i++) {
            // Skip if key was already clicked
            if (this.gameStateManager.isKeyClicked(i)) {
                // Make sure the key is destroyed if it exists
                const existingKey = this.container.getByName(`find-key-${i}`);
                if (existingKey) {
                    existingKey.destroy();
                }
                continue;
            }

            const keyName = `find-key-${i}`;
            const key = this.container.getByName(keyName);
            if (key) {
                key.setInteractive();
                key.on('pointerdown', () => this.handleKeyClick(i, key));
                this.keys.push(key);
            } else {
                console.log(`KEY_SETUP_MISSING: Key ${i} not found for interaction setup`);
            }
        }

    }

    handleKeyClick(index, key) {
        // Play click sound
        AudioUtils.playSound(this.scene, 'object_click', false);

        // Calculate move distance based on game dimensions
        const moveDistance = Math.min(this.scene.scale.width, this.scene.scale.height) * 0.1;

        // Create move up and fade out animation
        this.scene.tweens.add({
            targets: key,
            y: key.y - moveDistance,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                // Mark key as clicked in game state
                this.gameStateManager.markKeyClicked(index);
                
                // Destroy the key
                key.destroy();
                
                // Remove from our tracking array
                this.keys = this.keys.filter(k => k !== key);
                
                // Check if this was the last key and trigger win state
                if (this.gameStateManager.isAllKeysClicked()) {
                    this.gameStateManager.setGameState('win');
                }
            }
        });
    }

    cleanup() {
        // Clear keys array
        this.keys = [];
        
        // Kill all tweens
        if (this.scene && this.scene.tweens) {
            this.scene.tweens.killAll();
        }

        // Clear all pending timers
        if (this.scene && this.scene.time) {
            this.scene.time.removeAllEvents();
        }

        // Reset drag functionality
        if (this.container) {
            // Remove the drag handler if it exists
            if (this.dragHandler) {
                this.scene.input.off('drag', this.dragHandler);
                this.dragHandler = null;
            }
            
            // Disable dragging and interactivity
            if (this.container.input) {
                this.scene.input.setDraggable(this.container, false);
                this.container.disableInteractive();
            }
        }
        // Reset the drag listener flag
        this.dragListenerSet = false;

        // Re-setup container drag and keys
        this.setupKeysAndContainer();

        // Only restart key animations if we haven't clicked all keys
        if (!this.gameStateManager.isAllKeysClicked()) {
            this.startKeyAnimations();
        }
    }
} 