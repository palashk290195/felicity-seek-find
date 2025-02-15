import { EffectHandler } from './EffectHandler.js';
import { GAME_CONFIG } from '../scenes/utils/game-config.js';

export class HandEffect extends EffectHandler {
    constructor(scene) {
        super(scene, true); // true for persistent
        this.hand = null;
        this.handShadow = null;
        this.palmShadow = null;
        this.leftPalm = null;
        this.rightPalm = null;
        this.pendulumTween = null;
        this.initialAnimationComplete = false;
    }

    trigger() {
        if (this.isActive) {
            console.log('Hand effect: Already active');
            return;
        }
        
        console.log('Hand effect: Triggering');
        
        // Get all required objects from main container
        const mainContainer = this.scene['main-container'];
        this.hand = mainContainer.getByName('hand');
        this.handShadow = mainContainer.getByName('hand-shadow');
        this.palmShadow = mainContainer.getByName('palm-shadow');
        this.leftPalm = mainContainer.getByName('left-palm');
        this.rightPalm = mainContainer.getByName('right-palm');

        if (!this.hand || !this.handShadow || !this.palmShadow || !this.leftPalm || !this.rightPalm) {
            console.warn('Hand effect: Required objects not found', {
                hand: !!this.hand,
                handShadow: !!this.handShadow,
                palmShadow: !!this.palmShadow,
                leftPalm: !!this.leftPalm,
                rightPalm: !!this.rightPalm
            });
            return;
        }

        // Store original positions
        const objects = [this.hand, this.handShadow, this.palmShadow, this.leftPalm, this.rightPalm];
        const originalPositions = objects.map(obj => ({ x: obj.x, y: obj.y }));
        
        // Make all objects visible
        objects.forEach(obj => obj.setVisible(true));
        
        // Set initial positions (lower by offset)
        const offset = this.scene.scale.height * GAME_CONFIG.animation.handEffect.initialOffset;
        objects.forEach((obj, index) => {
            obj.setPosition(originalPositions[index].x, originalPositions[index].y + offset);
        });

        // Create upward movement animation
        this.scene.tweens.add({
            targets: objects,
            y: (target, targetKey, value, targetIndex) => originalPositions[targetIndex].y,
            duration: GAME_CONFIG.animation.handEffect.initialDuration,
            ease: 'Linear',
            onComplete: () => {
                console.log('Hand effect: Initial animation complete');
                this.initialAnimationComplete = true;
                this.startPendulumAnimation();
            }
        });

        this.isActive = true;
    }

    startPendulumAnimation() {
        if (!this.palmShadow || !this.leftPalm || !this.rightPalm || !this.initialAnimationComplete) {
            console.log('Hand effect: Cannot start pendulum', {
                palmShadow: !!this.palmShadow,
                leftPalm: !!this.leftPalm,
                rightPalm: !!this.rightPalm,
                initialComplete: this.initialAnimationComplete
            });
            return;
        }

        console.log('Hand effect: Starting pendulum');

        // Clear any existing pendulum animation
        if (this.pendulumTween) {
            this.pendulumTween.stop();
            this.pendulumTween = null;
        }

        const pendulumObjects = [this.palmShadow, this.leftPalm, this.rightPalm];

        // Create a single time tween to the first position to avoid jerk movement
        this.scene.tweens.add({
            targets: pendulumObjects,
            angle: -GAME_CONFIG.animation.handEffect.pendulumAngle,
            duration: GAME_CONFIG.animation.handEffect.pendulumDuration / 2,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                // Create the pendulum animation
                this.pendulumTween = this.scene.tweens.add({
                    targets: pendulumObjects,
                    angle: [-GAME_CONFIG.animation.handEffect.pendulumAngle, GAME_CONFIG.animation.handEffect.pendulumAngle],
                    duration: GAME_CONFIG.animation.handEffect.pendulumDuration,
                    ease: 'Sine.easeInOut',
                    yoyo: true,
                    repeat: -1
                });
            }
        });
    }

    handleResize() {
        console.log('HandEffect: Handle resize called', {
            isActive: this.isActive,
            initialAnimationComplete: this.initialAnimationComplete,
            hasPendulumTween: !!this.pendulumTween
        });
        
        if (!this.isActive) return;

        // Get the objects again as they might have been recreated by layout manager
        const mainContainer = this.scene['main-container'];
        this.hand = mainContainer.getByName('hand');
        this.handShadow = mainContainer.getByName('hand-shadow');
        this.palmShadow = mainContainer.getByName('palm-shadow');
        this.leftPalm = mainContainer.getByName('left-palm');
        this.rightPalm = mainContainer.getByName('right-palm');

        if (!this.hand || !this.handShadow || !this.palmShadow || !this.leftPalm || !this.rightPalm) {
            console.warn('Hand effect: Objects not found after resize');
            return;
        }

        // Make sure all objects stay visible
        const objects = [this.hand, this.handShadow, this.palmShadow, this.leftPalm, this.rightPalm];
        objects.forEach(obj => obj.setVisible(true));
        console.log('Hand effect: Ensuring all objects are visible after resize');

        // Stop existing pendulum tween if any
        if (this.pendulumTween) {
            console.log('HandEffect: Stopping existing pendulum tween');
            this.pendulumTween.stop();
            this.pendulumTween = null;
        }

        // Reset angles before starting new tween
        [this.palmShadow, this.leftPalm, this.rightPalm].forEach(obj => {
            obj.setAngle(0);
        });

        // Objects' positions are handled by layout manager
        // Just need to restart pendulum if it was active
        if (this.initialAnimationComplete) {
            console.log('HandEffect: Restarting pendulum animation');
            this.startPendulumAnimation();
        }
    }

    cleanup() {
        if (this.pendulumTween) {
            this.pendulumTween.stop();
            this.pendulumTween = null;
        }

        // Reset angles and hide all objects
        const objects = [this.hand, this.handShadow, this.palmShadow, this.leftPalm, this.rightPalm];
        objects.forEach(obj => {
            if (obj) {
                obj.setAngle(0);
                obj.setVisible(false);
            }
        });

        this.initialAnimationComplete = false;
        this.isActive = false;
        super.cleanup();
    }
} 