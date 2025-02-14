import { GAME_LAYOUT } from '../config/game-layout.js';
import { handleCtaPressed, adRetry } from "../networkPlugin.js";

export class GameStateManager {
    constructor(scene) {
        this.scene = scene;
        this.clickedObjects = new Set();
        this.gameState = 'playing'; // 'playing' or 'win'
        this.winAnimations = [];
        this.bgRabbit = null;
    }

    markObjectClicked(objectId) {
        this.clickedObjects.add(objectId);
        this.updateFoundObjectsCount();
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
            // First move container back to original position
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
        // Create BG-Rabbit if it doesn't exist
        if (!this.bgRabbit) {
            const isLandscape = this.scene.scale.width > this.scene.scale.height;
            const gameWidth = this.scene.scale.width;
            const gameHeight = this.scene.scale.height;

            // Create the rabbit off-screen at the top
            this.bgRabbit = this.scene.add.sprite(
                gameWidth * 0.5, // Center horizontally
                -gameHeight * 0.2, // Start above the screen
                'bg-rabbit'
            );

            // Make it interactive
            this.bgRabbit.setInteractive();
            this.bgRabbit.on('pointerdown', () => {
                adRetry();
                handleCtaPressed();
            });

            // Add to static container if it exists
            const staticContainer = this.scene['static-container'];
            if (staticContainer) {
                staticContainer.add(this.bgRabbit);
            }

            // Scale the rabbit appropriately
            const rabbitScale = Math.min(gameWidth, gameHeight) * 0.002;
            this.bgRabbit.setScale(rabbitScale);
        }

        // Animate the rabbit falling
        this.scene.tweens.add({
            targets: this.bgRabbit,
            y: this.scene.scale.height * 0.5, // Fall to center of screen
            duration: 1000,
            ease: 'Bounce.Out'
        });
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
            const gameWidth = this.scene.scale.width;
            const gameHeight = this.scene.scale.height;
            
            // Update position
            this.bgRabbit.setPosition(
                gameWidth * 0.5,
                gameHeight * 0.5
            );

            // Update scale
            const rabbitScale = Math.min(gameWidth, gameHeight) * 0.002;
            this.bgRabbit.setScale(rabbitScale);
        }
    }
} 