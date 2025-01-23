export class TutorialManager {
    constructor(scene, hand) {
        this.scene = scene;
        this.hand = hand;
        this.isActive = true;
        this.handTween = null;
        
        // Store original container reference
        this.handContainer = hand.parentContainer;

        this.setupHand();
        this.startHandAnimation();
        
        // Listen for layout updates
        this.scene.events.on('layout-updated', this.handleLayoutUpdate, this);
    }

    setupHand() {
        if (!this.hand || !this.isActive) return;

        // Get the current world position before reparenting
        const worldMatrix = this.hand.getWorldTransformMatrix();
        const worldX = worldMatrix.tx;
        const worldY = worldMatrix.ty;
        const worldScaleX = this.hand.scaleX;
        const worldScaleY = this.hand.scaleY;

        // Remove from current container and add directly to scene
        this.hand.removeFromDisplayList();
        this.scene.add.existing(this.hand);

        // Restore world position and scale
        this.hand.setPosition(worldX, worldY);
        this.hand.setScale(worldScaleX, worldScaleY);
        
        // Set depth higher than benches
        this.hand.setDepth(2000);
    }

    handleLayoutUpdate = () => {
        // Reapply our changes after layout update
        if (this.isActive) {
            this.setupHand();
        }
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
        this.scene.events.off('layout-updated', this.handleLayoutUpdate, this);
        this.stopTutorial();
    }
} 