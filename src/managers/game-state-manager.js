import { adEnd } from "../networkPlugin";
import { AudioUtils } from "../utils/audio-utils.js";
import { getCurrentLanguage } from "../scenes/utils/game-config.js";

export class GameStateManager {
    constructor(scene) {
        this.scene = scene;
        this.destroyedCats = new Set();
        this.gameState = 'playing'; // 'playing' or 'win'
        this.winAnimations = [];
    }

    markCatDestroyed(catIndex) {
        this.destroyedCats.add(catIndex);
        // Remove the automatic win state trigger from here
        // Let ObjectInteractionManager call setGameState when animations are done
    }

    isCatDestroyed(catIndex) {
        return this.destroyedCats.has(catIndex);
    }

    isAllCatsDestroyed() {
        return this.destroyedCats.size === 5;
    }

    setGameState(state) {
        if (this.gameState === state) return;
        
        this.gameState = state;
        if (state === 'win') {
            this.startWinAnimations();
            adEnd();
        }
    }

    startWinAnimations() {
        // Stop any existing animations
        this.stopWinAnimations();
        AudioUtils.playSound(this.scene, getCurrentLanguage().voiceoverKey);

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
    }
} 