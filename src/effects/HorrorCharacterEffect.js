import { EffectHandler } from './EffectHandler.js';
import { GAME_CONFIG } from '../scenes/utils/game-config.js';
import * as Phaser from '../phaser/phaser-3.87.0-core.js';

export class HorrorCharacterEffect extends EffectHandler {
    constructor(scene) {
        super(scene, true); // true for persistent
        this.character = null;
        this.blood = null;
        this.initialAnimationComplete = false;
    }

    trigger() {
        if (this.isActive) {
            console.log('Horror character effect: Already active');
            return;
        }
        
        console.log('Horror character effect: Triggering');
        
        // Get required objects from main container
        const mainContainer = this.scene['main-container'];
        this.character = mainContainer.getByName('horror-character');
        this.blood = mainContainer.getByName('blood');

        if (!this.character || !this.blood) {
            console.warn('Horror character effect: Required objects not found', {
                character: !!this.character,
                blood: !!this.blood
            });
            return;
        }

        // Store original positions
        const originalX = this.character.x;
        const originalY = this.character.y;
        const width = this.character.width * this.character.scaleX;

        // Calculate and set initial position (offset to the right)
        const offset = width * GAME_CONFIG.animation.horrorCharacterEffect.positionOffset;
        this.character.setPosition(originalX + offset, originalY);

        // Make objects visible explicitly
        this.character.setVisible(true);
        this.blood.setVisible(true);

        // Hide blood initially
        this.blood.setAlpha(0);

        console.log('Horror character effect: Starting movement', {
            fromX: originalX + offset,
            toX: originalX,
            offset,
            width
        });

        // Create movement animation
        this.scene.tweens.add({
            targets: this.character,
            x: originalX,
            duration: GAME_CONFIG.animation.horrorCharacterEffect.initialDuration,
            ease: 'Linear',
            onComplete: () => {
                console.log('Horror character effect: Movement complete');
                this.initialAnimationComplete = true;
                this.startBloodAnimation();
            }
        });

        this.isActive = true;
    }

    startBloodAnimation() {
        if (!this.blood || !this.initialAnimationComplete) {
            console.warn('Horror character effect: Cannot start blood animation');
            return;
        }

        // Set initial blood alpha
        this.blood.setAlpha(GAME_CONFIG.animation.horrorCharacterEffect.bloodInitialAlpha);

        // Create blood fade in animation
        this.scene.tweens.add({
            targets: this.blood,
            alpha: 1,
            duration: GAME_CONFIG.animation.horrorCharacterEffect.bloodAlphaDuration,
            ease: 'Linear'
        });
    }

    handleResize() {
        if (!this.isActive) return;

        // Get objects again as they might have been recreated
        const mainContainer = this.scene['main-container'];
        this.character = mainContainer.getByName('horror-character');
        this.blood = mainContainer.getByName('blood');

        if (!this.character || !this.blood) {
            console.warn('Horror character effect: Objects not found after resize');
            return;
        }

        // Make sure objects stay visible in final state
        this.character.setVisible(true);
        this.blood.setVisible(true);

        // If initial animation was complete, ensure blood is fully visible
        if (this.initialAnimationComplete) {
            this.blood.setAlpha(1);
        }

        console.log('Horror character effect: Maintained visibility after resize');
    }

    cleanup() {
        // Hide all objects
        if (this.character) this.character.setVisible(false);
        if (this.blood) {
            this.blood.setVisible(false);
            this.blood.setAlpha(0);
        }

        this.initialAnimationComplete = false;
        this.isActive = false;
        super.cleanup();
    }
} 