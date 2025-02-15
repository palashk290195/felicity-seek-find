import { EffectHandler } from './EffectHandler.js';
import { GAME_CONFIG } from '../scenes/utils/game-config.js';

export class SpiderEffect extends EffectHandler {
    constructor(scene) {
        super(scene, true); // true for persistent
        this.spider = null;
        this.thread = null;
        this.pendulumTween = null;
        this.initialAnimationComplete = false;
    }

    trigger() {
        if (this.isActive) {
            console.log('Spider effect: Already active');
            return;
        }
        
        console.log('Spider effect: Triggering');
        
        // Get the objects from main container
        const mainContainer = this.scene['main-container'];
        this.spider = mainContainer.getByName('spider');
        this.thread = mainContainer.getByName('spider-thread');

        if (!this.spider || !this.thread) {
            console.warn('Spider effect: Required objects not found', {
                spider: this.spider,
                thread: this.thread
            });
            return;
        }

        console.log('Spider effect: Found objects', {
            spiderPos: { x: this.spider.x, y: this.spider.y },
            threadPos: { x: this.thread.x, y: this.thread.y }
        });

        // Store original positions
        const threadOriginalY = this.thread.y;
        const spiderOriginalY = this.spider.y;

        // Set initial positions and alpha
        this.thread.setAlpha(0);
        this.spider.setAlpha(0);
        this.spider.setVisible(true);
        this.thread.setVisible(true);
        
        // Move both to starting positions (thread above its final position)
        this.thread.y = threadOriginalY - this.thread.displayHeight;
        this.spider.y = this.thread.y; // Start spider at thread's position

        console.log('Spider effect: Starting animation', {
            threadStart: this.thread.y,
            threadEnd: threadOriginalY,
            spiderStart: this.spider.y,
            spiderEnd: spiderOriginalY
        });

        // Create parallel tweens for both objects
        this.scene.tweens.add({
            targets: [this.thread, this.spider],
            y: function (target) {
                return target === this.thread ? threadOriginalY : spiderOriginalY;
            }.bind(this),
            alpha: 1,
            duration: GAME_CONFIG.animation.spiderEffect.initialDuration,
            ease: 'Linear',
            onComplete: () => {
                console.log('Spider effect: Initial animation complete');
                this.initialAnimationComplete = true;
                this.startPendulumAnimation();
            }
        });

        this.isActive = true;
    }

    startPendulumAnimation() {
        if (!this.spider || !this.initialAnimationComplete) {
            console.log('Spider effect: Cannot start pendulum', {
                spider: !!this.spider,
                initialComplete: this.initialAnimationComplete
            });
            return;
        }

        console.log('Spider effect: Starting pendulum');

        // Clear any existing pendulum animation
        if (this.pendulumTween) {
            this.pendulumTween.stop();
            this.pendulumTween = null;
        }

        // Create a single time tween to the first position to avoid jerk movement
        this.scene.tweens.add({
            targets: this.spider,
            angle: -GAME_CONFIG.animation.spiderEffect.pendulumAngle,
            duration: GAME_CONFIG.animation.spiderEffect.pendulumDuration / 2,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                // Create the pendulum animation
                this.pendulumTween = this.scene.tweens.add({
                    targets: this.spider,
                    angle: [-GAME_CONFIG.animation.spiderEffect.pendulumAngle, GAME_CONFIG.animation.spiderEffect.pendulumAngle],
                    duration: GAME_CONFIG.animation.spiderEffect.pendulumDuration,
                    ease: 'Sine.easeInOut',
                    yoyo: true,
                    repeat: -1,
                    onComplete: () => {
                        console.log('Spider effect: Pendulum animation complete');
                    }
                });
            }
        });
    }

    handleResize() {
        console.log('SpiderEffect: Handle resize called', {
            isActive: this.isActive,
            initialAnimationComplete: this.initialAnimationComplete,
            hasPendulumTween: !!this.pendulumTween
        });
        
        if (!this.isActive) return;

        // Get the objects again as they might have been recreated by layout manager
        const mainContainer = this.scene['main-container'];
        this.spider = mainContainer.getByName('spider');
        this.thread = mainContainer.getByName('spider-thread');

        if (!this.spider || !this.thread) {
            console.warn('Spider effect: Objects not found after resize');
            return;
        }

        // Ensure objects are visible
        this.spider.setVisible(true);
        this.thread.setVisible(true);
        this.spider.setAlpha(1);
        this.thread.setAlpha(1);

        // Stop existing pendulum tween if any
        if (this.pendulumTween) {
            console.log('SpiderEffect: Stopping existing pendulum tween');
            this.pendulumTween.stop();
            this.pendulumTween = null;
        }

        // Reset angle before starting new tween
        this.spider.setAngle(0);

        // Objects' positions are handled by layout manager
        // Just need to restart pendulum if it was active
        if (this.initialAnimationComplete) {
            console.log('SpiderEffect: Restarting pendulum animation');
            this.startPendulumAnimation();
        }
    }

    cleanup() {
        if (this.pendulumTween) {
            this.pendulumTween.stop();
            this.pendulumTween = null;
        }

        if (this.spider) {
            this.spider.setAngle(0);
        }

        this.initialAnimationComplete = false;
        this.isActive = false;
        super.cleanup();
    }
} 