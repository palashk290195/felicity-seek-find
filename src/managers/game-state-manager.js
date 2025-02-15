import { GAME_LAYOUT } from '../config/game-layout.js';
import { handleCtaPressed, adRetry } from "../networkPlugin.js";
import * as Phaser from '../phaser/phaser-3.87.0-core.js';

export class GameStateManager {
    constructor(scene) {
        this.scene = scene;
        this.clickedObjects = new Set();
        this.gameState = 'playing'; // 'playing' or 'win'
        this.winAnimations = [];
        this.bgRabbit = null;
        this.events = new Phaser.Events.EventEmitter();
    }

    addClickedObject(object) {
        this.clickedObjects.add(object);
        this.events.emit('objectFound', object);
        
        if (this.isAllObjectsFound()) {
            this.setGameState('win');
        }
    }

    markObjectClicked(objectId) {
        this.clickedObjects.add(objectId);
        this.updateFoundObjectsCount();
        this.scene.findTextManager.decrementCount(this.clickedObjects.size);
    }

    isObjectClicked(objectId) {
        return this.clickedObjects.has(objectId);
    }

    isAllObjectsFound() {
        return this.clickedObjects.size === 6; // We need to find 6 objects
    }

    updateFoundObjectsCount() {
        // Update the counter text if it exists
        const counterText = this.scene['counter-text'];
        if (counterText) {
            counterText.setText(`${this.clickedObjects.size}/6`);
        }
    }

    setGameState(state) {
        if (this.gameState === state) return;
        
        this.gameState = state;
        if (state === 'win') {
            const mainContainer = this.scene['main-container'];
            if (mainContainer) {
                // Get the original position from layout
                const isLandscape = this.scene.scale.width > this.scene.scale.height;
                const containerConfig = GAME_LAYOUT.containers['main-container'];
                const originalX = isLandscape ? containerConfig.landscape.x : containerConfig.portrait.x;
                const originalY = isLandscape ? containerConfig.landscape.y : containerConfig.portrait.y;
                
                // Convert to pixel coordinates
                const targetX = originalX * this.scene.scale.width;
                const targetY = originalY * this.scene.scale.height;
                
                // Create tween to move container back
                this.scene.tweens.add({
                    targets: mainContainer,
                    x: targetX,
                    y: targetY,
                    duration: 500,
                    ease: 'Power2',
                    onComplete: () => {
                        this.startWinAnimations();
                    }
                });
            }
        }
    }

    startWinAnimations() {
        // Stop any existing animations
        this.stopWinAnimations();

        // Create and show BG-Rabbit with fall animation
        this.createBGRabbit();
    }

    createBGRabbit() {
        // Get the existing bg-rabbit from the layout
        this.bgRabbit = this.scene['bg-rabbit'];
        if (this.bgRabbit) {
            const gameHeight = this.scene.scale.height;

            // Position it above the screen
            this.bgRabbit.setPosition(this.bgRabbit.x, -2 * gameHeight);
            this.bgRabbit.setVisible(true);

            // Make it interactive if not already
            if (!this.bgRabbit.input) {
                this.bgRabbit.setInteractive();
                this.bgRabbit.on('pointerdown', () => {
                    adRetry();
                    handleCtaPressed();
                });
            }

            // Animate the rabbit falling
            this.scene.tweens.add({
                targets: this.bgRabbit,
                y: 0, // Move to center of screen
                duration: 1000, // 1 second duration
                ease: 'Bounce.Out'
            });
        }
    }

    stopWinAnimations() {
        // Stop all existing win animations
        this.winAnimations.forEach(tween => {
            if (tween && tween.isPlaying()) {
                tween.stop();
            }
        });
        this.winAnimations = [];

        // Destroy BG-Rabbit if it exists
        if (this.bgRabbit) {
            this.bgRabbit.destroy();
            this.bgRabbit = null;
        }
    }

    handleResize() {
        // If in win state, reposition and rescale BG-Rabbit
        if (this.gameState === 'win' && this.bgRabbit) {
            this.bgRabbit.setVisible(true);
        }
    }
} 