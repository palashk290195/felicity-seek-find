import { AudioUtils } from '../../utils/audio-utils.js';
import * as Phaser from '../../phaser/phaser-3.87.0-core.js';

export class BenchInteractionManager {
    constructor(scene, benches, heartBg) {
        this.scene = scene;
        this.benches = benches;
        this.heartBg = heartBg;
        this.clickedCount = 0;
        this.requiredClicks = 5;
        
        // Get glow references
        this.benchGlows = benches.map((bench, index) => {
            const glowNumber = index + 1;
            return this.scene.layoutManager.getAsset(`bench_glow${glowNumber}`);
        });
        
        this.setupBenches();
    }

    setupBenches() {
        this.benches.forEach((bench, index) => {
            if (!bench || !bench.active) return; // Skip if bench is destroyed or inactive
            
            // Set up interaction
            bench.setInteractive();
            bench.setBlendMode(Phaser.BlendModes.MULTIPLY);
            bench.setAlpha(0.6);
            this.benchGlows[index].setAlpha(0.4);
            bench.on('pointerdown', () => this.handleBenchClick(bench, this.benchGlows[index]));
            bench.active = true; // Set initial active state
        });
    }

    getHeartWorldPosition() {
        // Get the heart's world matrix
        const heartMatrix = this.heartBg.getWorldTransformMatrix();
        
        // Get the world position
        const worldX = heartMatrix.tx;
        const worldY = heartMatrix.ty;
        
        return { x: worldX, y: worldY };
    }

    handleBenchClick(bench, glow) {
        // Prevent multiple clicks on same bench
        if (!bench.active) return;
        bench.active = false;
        bench.removeInteractive();
        bench.setAlpha(1);

        // Play tap sound using AudioUtils
        AudioUtils.playSound(this.scene, 'user_tap_audio', { volume: 1 });
        AudioUtils.playSound(this.scene, 'wood_block_flying_audio', { volume: 1 });

        // Get current world position before removing from container
        const benchWorldMatrix = bench.getWorldTransformMatrix();
        const benchWorldX = benchWorldMatrix.tx;
        const benchWorldY = benchWorldMatrix.ty;
        const benchWorldScaleX = bench.scaleX;
        const benchWorldScaleY = bench.scaleY;

        // Remove from container and add to scene
        bench.removeFromDisplayList();
        this.scene.add.existing(bench);
        bench.setPosition(benchWorldX, benchWorldY);
        bench.setScale(benchWorldScaleX, benchWorldScaleY);
        bench.setDepth(1000);

        // Increment click counter
        this.clickedCount++;

        // Get heart's world position
        const heartPos = this.getHeartWorldPosition();

        // Create movement tween to heart
        this.scene.tweens.add({
            targets: bench,
            x: heartPos.x,
            y: heartPos.y,
            scaleX: bench.scaleX,
            scaleY: bench.scaleY,
            duration: 500,
            ease: 'Quad.easeIn',
            onComplete: () => {
                // If in PLAYING state, reset heart visibility to 100%
                if (this.scene.gameStateManager.getCurrentState() === 'PLAYING') {
                    this.scene.heartManager.reset();
                    this.scene.heartManager.updateHeartVisibility();
                    this.scene.heartManager.startDecay(); // Restart decay
                }

                // Pulse heart
                this.scene.heartManager.pulseHeart();
                
                // Remove from benches array and destroy glow
                const index = this.benches.indexOf(bench);
                if (index > -1) {
                    this.benches[index] = null;
                    if (glow) {
                        glow.destroy();
                        this.benchGlows[index] = null;
                    }
                }
                
                // Destroy bench
                bench.destroy();

                // Check win condition
                if (this.clickedCount >= this.requiredClicks) {
                    this.scene.gameStateManager.setState('WIN');
                }
            }
        });

        // If this is the first click, transition from tutorial to playing
        if (this.clickedCount === 1) {
            this.scene.gameStateManager.setState('PLAYING');
        }
    }

    reset() {
        this.clickedCount = 0;
        this.benches.forEach((bench, index) => {
            if (bench) {
                bench.active = true;
                bench.setInteractive();
            }
        });
    }

    destroy() {
        // Clean up all benches and glows
        this.benches.forEach((bench, index) => {
            if (bench) bench.destroy();
            const glow = this.benchGlows[index];
            if (glow) glow.destroy();
        });
    }
} 