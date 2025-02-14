export class EffectHandler {
    constructor(scene, isPersistent = false) {
        this.scene = scene;
        this.isPersistent = isPersistent;
        this.isActive = false;
        this.tweens = [];
    }

    trigger(x, y) {
        if (this.isActive) {
            return;
        }
        this.isActive = true;
        // To be implemented by subclasses
    }

    cleanup() {
        this.isActive = false;
        // Stop all tweens
        this.tweens.forEach(tween => {
            if (tween && tween.isPlaying()) {
                tween.stop();
            }
        });
        this.tweens = [];
        // To be extended by subclasses for specific cleanup
    }

    handleResize() {
        // To be implemented by subclasses
        // Should handle repositioning of effect elements after resize
    }

    addTween(tween) {
        this.tweens.push(tween);
    }
} 