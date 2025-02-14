import { GAME_CONFIG } from '../scenes/utils/game-config.js';
import * as Phaser from '../phaser/phaser-3.87.0-core.js';

export class WrongClickManager {
    constructor(scene) {
        this.scene = scene;
        this.cross = null;
        this.isAnimating = false;
        this.mainContainer = this.scene['main-container'];
        this.createCross();
        this.setupContainerInteraction();
    }

    createCross() {
        // Create cross sprite
        this.cross = this.scene.add.sprite(0, 0, 'cross');
        this.cross.setVisible(false);

        // Add to main container to move with it
        if (this.mainContainer) {
            this.mainContainer.add(this.cross);
        }

        // Set initial scale
        this.updateCrossScale();
    }

    updateCrossScale() {
        if (!this.cross) return;

        const minDimension = Math.min(this.scene.scale.width, this.scene.scale.height);
        const targetSize = minDimension * GAME_CONFIG.animation.wrongClick.crossSize;

        // Calculate scale to maintain aspect ratio
        const scale = targetSize / Math.max(this.cross.width, this.cross.height);
        this.cross.setScale(scale);
    }

    setupContainerInteraction() {
        if (this.mainContainer) {
            // Initial setup of interactive area
            this.updateInteractiveArea();
            
            // Add pointer down listener
            this.mainContainer.on('pointerdown', (pointer) => {
                // Get pointer position relative to container
                const localPoint = this.mainContainer.getLocalPoint(pointer.x, pointer.y);
                this.showWrongClick(localPoint.x, localPoint.y);
            });
        }
    }

    updateInteractiveArea() {
        if (this.mainContainer) {
            // Make container interactive with a larger hit area matching game size
            this.mainContainer.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.scene.scale.width, this.scene.scale.height), Phaser.Geom.Rectangle.Contains);
        }
    }

    showWrongClick(x, y) {
        if (this.isAnimating || !this.cross) return;
        this.isAnimating = true;

        // Pause hint
        if (this.scene.hintManager) {
            this.scene.hintManager.pauseHint();
        }

        // Position cross at click coordinates
        this.cross.setPosition(x, y);
        this.cross.setAlpha(0);
        this.cross.setVisible(true);

        // Fade in and out animation
        this.scene.tweens.add({
            targets: this.cross,
            alpha: { from: 0, to: 1 },
            duration: GAME_CONFIG.animation.wrongClick.duration / 2,
            yoyo: true,
            onComplete: () => {
                this.cross.setVisible(false);
                this.isAnimating = false;
                
                // Resume hint after animation completes only if we have a valid target object
                if (this.scene.hintManager && 
                    !this.scene.gameStateManager.isAllObjectsFound() && 
                    this.scene.hintManager.currentTargetObject && 
                    !this.scene.hintManager.currentTargetObject.destroyed) {
                    this.scene.hintManager.scheduleResume();
                }
            }
        });

        // Shake main container
        this.shakeContainer();
    }

    shakeContainer() {
        const container = this.scene['main-container'];
        if (!container) return;

        const minDimension = Math.min(this.scene.scale.width, this.scene.scale.height);
        const shakeDistance = minDimension * GAME_CONFIG.animation.wrongClick.shake.intensity;

        // Store original position
        const originalX = container.x;
        const originalY = container.y;

        // Create shake tween
        this.scene.tweens.add({
            targets: container,
            x: originalX + shakeDistance,
            y: originalY + shakeDistance,
            duration: GAME_CONFIG.animation.wrongClick.shake.duration,
            yoyo: true,
            repeat: 1,
            ease: GAME_CONFIG.animation.wrongClick.shake.ease,
            onComplete: () => {
                // Ensure container returns to original position
                container.setPosition(originalX, originalY);
            }
        });
    }

    handleResize() {
        this.updateCrossScale();
        this.updateInteractiveArea();
    }

    cleanup() {
        if (this.cross) {
            this.cross.destroy();
            this.cross = null;
        }
    }
} 