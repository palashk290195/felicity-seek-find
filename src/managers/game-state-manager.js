import { GAME_LAYOUT } from '../config/game-layout.js';

export class GameStateManager {
    constructor(scene) {
        this.scene = scene;
        this.clickedKeys = new Set();
        this.gameState = 'playing'; // 'playing' or 'win'
        this.winAnimations = [];
    }

    markKeyClicked(keyIndex) {
        this.clickedKeys.add(keyIndex);
        this.updateShowFoundVisibility();
    }

    isKeyClicked(keyIndex) {
        return this.clickedKeys.has(keyIndex);
    }

    isAllKeysClicked() {
        return this.clickedKeys.size === 4;
    }

    updateShowFoundVisibility() {
        console.log('[Game state manager show found] Updating show-found visibility based on clicked keys');
        // Show the appropriate number of show-found elements based on clicked keys
        for (let i = 1; i <= 4; i++) {
            const showFound = this.scene[`show-found${i}`];
            if (showFound) {
                console.log(`[Game state manager show found] Setting visibility for show-found${i} to ${i <= this.clickedKeys.size}`);
                showFound.setVisible(i <= this.clickedKeys.size);
            } else {
                console.warn(`[Game state manager show found] show-found${i} not found`);
            }
        }
        console.log(`[Game state manager show found] Clicked keys: ${Array.from(this.clickedKeys).join(', ')}`);
        console.log(`[Game state manager show found] Show-found visibility updated`);
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
                        // After container is in position, destroy locks in sequence
                        this.destroyLocksInSequence();
                    }
                });
            }
        }
    }

    destroyLocksInSequence() {
        const destroyLock = (index) => {
            const lock = this.scene[`lock${index}`];
            if (lock) {
                // Create fade out and scale up tween
                this.scene.tweens.add({
                    targets: lock,
                    alpha: 0,
                    scaleX: lock.scaleX * 1.5,
                    scaleY: lock.scaleY * 1.5,
                    duration: 300,
                    ease: 'Power2',
                    onComplete: () => {
                        lock.destroy();
                        // If there are more locks, destroy the next one
                        if (index < 4) {
                            // Add a small delay before destroying next lock
                            this.scene.time.delayedCall(100, () => {
                                destroyLock(index + 1);
                            });
                        } else {
                            // All locks destroyed, transition to EndCard scene
                            this.scene.scene.start('EndCard');
                        }
                    }
                });
            }
        };

        // Start with the first lock
        destroyLock(1);
    }

    startWinAnimations() {
        // Stop any existing animations
        this.stopWinAnimations();

        const layoutManager = this.scene.layoutManager;
        
        // Show win state assets
        const brightOverlay = layoutManager.getAsset('bright-overlay');
        const playNow = layoutManager.getAsset('play-now');
        const logo = layoutManager.getAsset('logo');
        const seekFindText = layoutManager.getAsset('seek-find-text');

        if (brightOverlay) {
            brightOverlay.setVisible(true);
            // Create rotating animation
            const rotationTween = this.scene.tweens.add({
                targets: brightOverlay,
                angle: 360,
                duration: 4000,
                repeat: -1,
                ease: 'Linear'
            });
            this.winAnimations.push(rotationTween);
        }

        if (playNow) {
            playNow.setVisible(true);
            // Create scale animation
            const scaleTween = this.scene.tweens.add({
                targets: playNow,
                scale: '*=1.2',
                duration: 800,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            this.winAnimations.push(scaleTween);
        }

        if (logo) {
            logo.setVisible(true);
        }

        if (seekFindText) {
            seekFindText.setVisible(true);
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
    }

    handleResize() {
        // If in win state, restart animations after layout update
        if (this.gameState === 'win') {
            this.startWinAnimations();
        }
        // Update show-found visibility on resize
        this.updateShowFoundVisibility();
    }
} 