import { EffectHandler } from './EffectHandler.js';
import { GAME_CONFIG } from '../scenes/utils/game-config.js';

export class OrangeLightEffect extends EffectHandler {
    constructor(scene) {
        super(scene, true); // true for persistent
        this.orangeLight = null;
        this.orangeLight2 = null;
        this.lightballs1 = null;
        this.lightballs2 = null;
        this.lightballsTween = null;
    }

    trigger(x, y) {
        if (this.isActive) {
            return;
        }
        
        // Get all required objects from main container
        const mainContainer = this.scene['main-container'];
        this.orangeLight = mainContainer.getByName('orange-light');
        this.orangeLight2 = mainContainer.getByName('orange-light2');
        this.lightballs1 = mainContainer.getByName('orange-lightballs1');
        this.lightballs2 = mainContainer.getByName('orange-lightballs2');

        if (!this.orangeLight || !this.orangeLight2 || !this.lightballs1 || !this.lightballs2) {
            console.warn('Orange light effect: Required objects not found', {
                light1: !!this.orangeLight,
                light2: !!this.orangeLight2,
                balls1: !!this.lightballs1,
                balls2: !!this.lightballs2
            });
            return;
        }

        // Make orange lights visible
        this.orangeLight.setVisible(true);
        this.orangeLight2.setVisible(true);

        // Initial state for lightballs
        this.lightballs1.setVisible(true);
        this.lightballs2.setVisible(false);

        // Start alternating lightballs animation
        this.startLightballsAnimation();

        this.isActive = true;
    }

    startLightballsAnimation() {
        // Clear any existing timer event
        if (this.lightballsTween) {
            this.lightballsTween.destroy();
            this.lightballsTween = null;
        }

        // Create a timer event that repeats
        this.lightballsTween = this.scene.time.addEvent({
            delay: GAME_CONFIG.animation.orangeLightEffect.lightballsDuration,
            callback: () => {
                // Toggle visibility of both lightballs
                this.lightballs1.setVisible(!this.lightballs1.visible);
                this.lightballs2.setVisible(!this.lightballs2.visible);
            },
            loop: true
        });
    }

    handleResize() {
        if (!this.isActive) return;

        // Get objects again as they might have been recreated
        const mainContainer = this.scene['main-container'];
        this.orangeLight = mainContainer.getByName('orange-light');
        this.orangeLight2 = mainContainer.getByName('orange-light2');
        this.lightballs1 = mainContainer.getByName('orange-lightballs1');
        this.lightballs2 = mainContainer.getByName('orange-lightballs2');

        if (!this.orangeLight || !this.orangeLight2 || !this.lightballs1 || !this.lightballs2) {
            console.warn('Orange light effect: Objects not found after resize');
            return;
        }

        // Ensure orange lights stay visible
        this.orangeLight.setVisible(true);
        this.orangeLight2.setVisible(true);

        // Restart lightballs animation
        this.startLightballsAnimation();
    }

    cleanup() {
        if (this.lightballsTween) {
            this.lightballsTween.destroy();
            this.lightballsTween = null;
        }

        // Hide all objects
        if (this.orangeLight) this.orangeLight.setVisible(false);
        if (this.orangeLight2) this.orangeLight2.setVisible(false);
        if (this.lightballs1) this.lightballs1.setVisible(false);
        if (this.lightballs2) this.lightballs2.setVisible(false);

        this.isActive = false;
        super.cleanup();
    }
} 