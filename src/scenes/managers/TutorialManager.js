export class TutorialManager {
    constructor(scene, hand) {
        this.scene = scene;
        this.hand = hand;
        this.isActive = true;
        this.handTween = null;
        
        this.startHandAnimation();
    }

    startHandAnimation() {
        if (!this.isActive || !this.hand) return;

        // Get current scale
        const currentScale = this.hand.scale;

        // Create hand tween
        this.handTween = this.scene.tweens.add({
            targets: this.hand,
            scaleX: currentScale * 1.2,
            scaleY: currentScale * 1.2,
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Quad.easeInOut'
        });
    }

    stopTutorial() {
        this.isActive = false;
        
        if (this.handTween) {
            this.handTween.stop();
            this.handTween = null;
        }

        // Fade out and destroy hand
        if (this.hand) {
            this.scene.tweens.add({
                targets: this.hand,
                alpha: 0,
                duration: 300,
                onComplete: () => {
                    this.hand.destroy();
                    this.hand = null;
                }
            });
        }
    }

    destroy() {
        this.stopTutorial();
    }
} 