export class BenchInteractionManager {
    constructor(scene, benches, heartBg) {
        this.scene = scene;
        this.benches = benches;
        this.heartBg = heartBg;
        this.clickedCount = 0;
        this.requiredClicks = 5;
        
        this.setupBenches();
    }

    setupBenches() {
        this.benches.forEach(bench => {
            bench.setInteractive();
            bench.setDepth(1000); // Set high depth to ensure benches are above other elements
            bench.on('pointerdown', () => this.handleBenchClick(bench));
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

    handleBenchClick(bench) {
        // Prevent multiple clicks on same bench
        if (!bench.active) return;
        bench.active = false;
        bench.removeInteractive();

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
            bench.active = true;
            bench.setInteractive();
        });
    }
} 