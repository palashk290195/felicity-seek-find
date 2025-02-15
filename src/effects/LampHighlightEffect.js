import { EffectHandler } from './EffectHandler.js';
import { GAME_CONFIG } from '../scenes/utils/game-config.js';

export class LampHighlightEffect extends EffectHandler {
    constructor(scene) {
        super(scene, false); // false since not persistent
        this.highlight = null;
        this.flashTween = null;
        this.flashCount = 0;
        this.maxFlashes = GAME_CONFIG.animation.lampHighlightEffect.flashCount;
    }

    trigger(x, y) {
        if (this.isActive) {
            return;
        }
        
        // Get the lamp-highlight object from main container
        const mainContainer = this.scene['main-container'];
        this.highlight = mainContainer.getByName('lamp-highlight');

        if (!this.highlight) {
            console.warn('Lamp highlight effect: Required object not found');
            return;
        }

        // Make sure highlight is visible and rotate it
        this.highlight.setVisible(true);
        this.highlight.setAlpha(1);
        this.highlight.setAngle(GAME_CONFIG.animation.lampHighlightEffect.rotationAngle);

        // Start flash sequence
        this.flashCount = 0;
        this.createNextFlash();

        this.isActive = true;
    }

    createNextFlash() {
        if (this.flashCount >= this.maxFlashes) {
            // End the effect
            this.highlight.setVisible(false);
            this.highlight.setAlpha(0);
            this.highlight.setAngle(0); // Reset rotation
            this.isActive = false;
            return;
        }

        // Random duration between min and max from config
        const { min, max } = GAME_CONFIG.animation.lampHighlightEffect.flashDuration;
        const duration = min + (Math.random() * (max - min));

        // Create flash tween
        this.flashTween = this.scene.tweens.add({
            targets: this.highlight,
            alpha: 0,
            duration: duration,
            onComplete: () => {
                // Toggle visibility
                this.highlight.setAlpha(this.highlight.alpha === 0 ? 1 : 0);
                this.flashCount++;
                // Create next flash
                this.createNextFlash();
            }
        });
    }

    handleResize() {
        // No resize handling needed as per requirements
    }

    cleanup() {
        if (this.flashTween) {
            this.flashTween.stop();
            this.flashTween = null;
        }

        if (this.highlight) {
            this.highlight.setVisible(false);
            this.highlight.setAlpha(0);
            this.highlight.setAngle(0); // Reset rotation
        }

        this.flashCount = 0;
        this.isActive = false;
        super.cleanup();
    }
} 