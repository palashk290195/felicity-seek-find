import { GAME_CONFIG } from '../scenes/utils/game-config.js';

export class HintManager {
    constructor(scene, gameStateManager) {
        this.scene = scene;
        this.gameStateManager = gameStateManager;
        this.hintCircle = null;
        this.currentTargetObject = null;
        this.isHintPaused = false;
        this.hintTween = null;
        this.nextObjectTimer = null;
        this.resumeTimer = null;  // Track resume timer
        this.initialize();
    }

    initialize() {
        // Find first unclicked object
        for (let i = 1; i <= 6; i++) {
            if (!this.gameStateManager.isObjectClicked(i)) {
                const targetObject = this.scene[`find-object${i}`];
                if (targetObject) {
                    // Create hint circle
                    this.createHintCircle(targetObject);
                    // Start hint for this object
                    this.moveToObject(targetObject, i);
                    break;
                }
            }
        }
    }

    createHintCircle(targetObject) {
        // Create circle sprite
        this.hintCircle = this.scene.add.sprite(0, 0, 'hint-circle');
        
        // Add to main container to maintain relative positioning
        const mainContainer = this.scene['main-container'];
        if (mainContainer) {
            mainContainer.add(this.hintCircle);
        }

        // Set initial scale based on target object
        this.updateHintCircleSize(targetObject);
    }

    moveToObject(targetObject, objectIndex) {
        if (!targetObject || !this.hintCircle) return;

        // Store current target
        this.currentTargetObject = targetObject;

        // Update size and position
        this.updateHintCircleSize(targetObject);
        this.updateHintPosition();

        // Start or restart tween
        this.startHintTween();
    }

    updateHintCircleSize(targetObject) {
        if (!this.hintCircle || !targetObject) return;

        // Set circle size based on config
        const scale = Math.max(targetObject.displayWidth, targetObject.displayHeight) * 
                     GAME_CONFIG.animation.hintCircle.size;
        this.hintCircle.setScale(scale / this.hintCircle.width); // Normalize scale based on circle texture size
    }

    updateHintPosition() {
        if (!this.hintCircle || !this.currentTargetObject) return;

        // Position circle at target object's center
        this.hintCircle.setPosition(
            this.currentTargetObject.x,
            this.currentTargetObject.y
        );
    }

    startHintTween() {
        // Stop existing tween if any
        if (this.hintTween) {
            this.hintTween.stop();
            this.hintTween = null;
        }

        // Create new scale tween
        const baseScale = this.hintCircle.scale;
        this.hintTween = this.scene.tweens.add({
            targets: this.hintCircle,
            scaleX: baseScale * GAME_CONFIG.animation.hintCircle.scaleUp,
            scaleY: baseScale * GAME_CONFIG.animation.hintCircle.scaleUp,
            duration: GAME_CONFIG.animation.hintCircle.duration,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    handleObjectClick(objectIndex) {
        // If clicked object is current target, find next unclicked object
        if (this.currentTargetObject === this.scene[`find-object${objectIndex}`]) {
            // Find next unclicked object
            let nextIndex = -1;
            for (let i = 1; i <= 6; i++) {
                if (!this.gameStateManager.isObjectClicked(i)) {
                    nextIndex = i;
                    break;
                }
            }

            // If found next object, prepare to move to it
            if (nextIndex !== -1) {
                const nextObject = this.scene[`find-object${nextIndex}`];
                if (nextObject) {
                    this.currentTargetObject = nextObject;
                }
            }
        }
    }

    pauseHint() {
        if (!this.hintCircle) return;
        
        this.isHintPaused = true;
        this.hintCircle.setVisible(false);
        if (this.hintTween) {
            this.hintTween.pause();
        }
    }

    resumeHint() {
        if (!this.hintCircle || !this.currentTargetObject) return;
        
        // Clear any existing resume timer
        if (this.resumeTimer) {
            this.resumeTimer.remove();
            this.resumeTimer = null;
        }

        this.isHintPaused = false;
        this.hintCircle.setVisible(true);
        
        // Move to the current target (which was updated in handleObjectClick)
        this.moveToObject(this.currentTargetObject);
    }

    scheduleResume() {
        // Clear any existing timer
        if (this.resumeTimer) {
            this.resumeTimer.remove();
            this.resumeTimer = null;
        }

        // Create new timer
        this.resumeTimer = this.scene.time.delayedCall(
            GAME_CONFIG.animation.hintCircle.nextObjectDelay,
            () => {
                this.resumeTimer = null;
                this.resumeHint();
            }
        );
    }

    handleResize() {
        if (!this.currentTargetObject) return;

        // If we're in the pause period (timer exists), restart the timer
        if (this.resumeTimer) {
            console.log('resuming hint');
            this.scheduleResume();
            return;
        }

        // Only update visuals if not paused
        if (!this.isHintPaused && this.hintCircle && this.currentTargetObject) {
            console.log('updating hint');
            this.updateHintCircleSize(this.currentTargetObject);
            this.updateHintPosition();
            this.startHintTween();
        }
    }

    cleanup() {
        if (this.hintTween) {
            this.hintTween.stop();
            this.hintTween = null;
        }
        if (this.nextObjectTimer) {
            this.nextObjectTimer.remove();
            this.nextObjectTimer = null;
        }
        if (this.resumeTimer) {
            this.resumeTimer.remove();
            this.resumeTimer = null;
        }
        if (this.hintCircle) {
            this.hintCircle.destroy();
            this.hintCircle = null;
        }
        this.currentTargetObject = null;
    }
} 