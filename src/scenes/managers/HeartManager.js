export class HeartManager {
    constructor(scene, heartMask) {
        this.scene = scene;
        this.heartMask = heartMask;
        this.heartBg = this.scene.layoutManager.getAsset('heart_bg');
        this.currentVisibility = 100;
        this.heartDecayRate = 1; // Percentage per 100 ms
        this.decayTimer = null;
        this.isDecaying = false;

        // Set depths to ensure heart bg is above mask
        this.heartBg.setDepth(100); // Higher depth than mask
        this.heartMask.setDepth(99);

        this.currentBgScale = this.heartBg.scale;
        this.currentMaskScale = this.heartMask.scale;

        // Set initial mask properties
        this.heartMask.setOrigin(0.5, 1); // Set origin to bottom center for bottom-up reveal
        this.updateHeartVisibility(); // Set initial visibility
    }

    startDecay() {
        if (this.isDecaying) return;
        this.isDecaying = true;

        // Create a timer event that updates every 100ms
        this.decayTimer = this.scene.time.addEvent({
            delay: 100,
            callback: this.updateHeartVisibility,
            callbackScope: this,
            loop: true
        });
    }

    stopDecay() {
        if (this.decayTimer) {
            this.decayTimer.destroy();
            this.decayTimer = null;
        }
        this.isDecaying = false;
    }

    updateHeartVisibility() {
        // Decrease visibility by decay rate * time since last update
        this.currentVisibility -= this.heartDecayRate;
        
        // Clamp visibility between 0 and 100
        this.currentVisibility = Math.max(0, Math.min(100, this.currentVisibility));
        
        // Calculate the crop to hide the top decay% of the heart mask
        const visibilityScale = this.currentVisibility / 100;
        const maskHeight = this.heartMask.height;
        const cropHeight = maskHeight * visibilityScale;
        const cropY = maskHeight - cropHeight;
        
        // Crop from top down based on visibility
        this.heartMask.setCrop(0, cropY, this.heartMask.width, cropHeight);

        // Check if heart is empty
        if (this.currentVisibility <= 0) {
            this.stopDecay();
            // Notify game state manager of loss
            this.scene.gameStateManager.setState('LOSE');
        }
    }

    pulseHeart() {
        // Get current scales

        // Create pulse animation for background
        this.scene.tweens.add({
            targets: this.heartBg,
            scale: {from: this.currentBgScale, to: this.currentBgScale * 1.2},
            duration: 1000,
            yoyo: true,
            ease: 'Quad.easeInOut'
        });

        // Create pulse animation for mask
        this.scene.tweens.add({
            targets: this.heartMask,
            scale: {from: this.currentMaskScale, to: this.currentMaskScale * 1.2},
            duration: 1000,
            yoyo: true,
            ease: 'Quad.easeInOut',
        });
    }

    reset() {
        this.stopDecay();
        this.currentVisibility = 100;
        this.updateHeartVisibility();
    }
} 