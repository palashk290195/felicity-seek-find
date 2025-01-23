import { AudioUtils } from '../../utils/audio-utils.js';

export class BenchInteractionManager {
    constructor(scene, benches, heartBg) {
        this.scene = scene;
        this.benches = benches;
        this.heartBg = heartBg;
        this.clickedCount = 0;
        this.requiredClicks = 5;
        
        // Store original container references
        this.benchContainers = benches.map(bench => bench.parentContainer);
        
        this.setupBenches();
        
        // Listen for layout updates
        this.scene.events.on('layout-updated', this.handleLayoutUpdate, this);
    }

    setupBenches() {
        this.benches.forEach((bench, index) => {
            if (!bench || !bench.active) return; // Skip if bench is destroyed or inactive
            
            // Get the current world position before reparenting
            const worldMatrix = bench.getWorldTransformMatrix();
            const worldX = worldMatrix.tx;
            const worldY = worldMatrix.ty;
            const worldScaleX = bench.scaleX;
            const worldScaleY = bench.scaleY;

            // Remove from current container and add directly to scene
            bench.removeFromDisplayList();
            this.scene.add.existing(bench);

            // Restore world position and scale
            bench.setPosition(worldX, worldY);
            bench.setScale(worldScaleX, worldScaleY);
            
            // Set up interaction
            bench.setInteractive();
            bench.setDepth(1000); // Set high depth to ensure benches are above other elements
            bench.on('pointerdown', () => this.handleBenchClick(bench));
            bench.active = true; // Set initial active state
        });
    }

    handleLayoutUpdate = () => {
        // Reapply our changes after layout update
        this.setupBenches();
    }

    getHeartWorldPosition() {
        // Get the heart's world matrix
        const heartMatrix = this.heartBg.getWorldTransformMatrix();
        
        // Get the world position
        const worldX = heartMatrix.tx;
        const worldY = heartMatrix.ty;
        
        return { x: worldX, y: worldY };
    }

    handleBenchClick(bench) {
        // Prevent multiple clicks on same bench
        if (!bench.active) return;
        bench.active = false;
        bench.removeInteractive();

        // Play tap sound using AudioUtils
        AudioUtils.playSound(this.scene, 'user_tap_audio');
        AudioUtils.playSound(this.scene, 'wood_block_flying_audio');

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
                
                // Remove from benches array
                const index = this.benches.indexOf(bench);
                if (index > -1) {
                    this.benches[index] = null;
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
        this.benches.forEach(bench => {
            if (bench) {
                bench.active = true;
                bench.setInteractive();
            }
        });
    }

    destroy() {
        this.scene.events.off('layout-updated', this.handleLayoutUpdate, this);
    }
} 