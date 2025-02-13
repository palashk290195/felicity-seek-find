export class ObjectInteractionManager {
    constructor(scene, gameStateManager) {
        this.scene = scene;
        this.gameStateManager = gameStateManager;
        this.cats = [];
        this.highlights = [];
        this.container = this.scene['main-container'];
        this.setupCats();
    }

    setupCats() {
        // Setup all 5 cats with interaction
        for (let i = 1; i <= 5; i++) {
            const catKey = `cat-${i}`;
            const cat = this.container.getByName(catKey);
            if (cat) {
                // Skip if cat was already destroyed
                if (this.gameStateManager.isCatDestroyed(i)) {
                    cat.destroy();
                    continue;
                }
                
                cat.setInteractive();
                cat.on('pointerdown', () => this.handleCatClick(i, cat));
                this.cats.push(cat);
            }
        }
    }

    handleCatClick(index, cat) {
        // Get the cat's position and dimensions
        const catWidth = cat.displayWidth;
        const catHeight = cat.displayHeight;
        const maxDimension = Math.max(catWidth, catHeight);

        // Create rotating highlight effect and scale it to match cat's max dimension
        const rotatingHighlight = this.scene.add.image(cat.x, cat.y, 'highlight');
        rotatingHighlight.setOrigin(0.5);
        // Set initial scale to match cat's max dimension
        const rotatingHighlightScale = 3 * maxDimension / rotatingHighlight.width;
        rotatingHighlight.setScale(rotatingHighlightScale);
        this.container.add(rotatingHighlight);

        // Create cat highlight at the same position
        const highlightKey = `cat-${index}-highlight`;
        const highlight = this.scene.add.image(cat.x, cat.y, highlightKey);
        highlight.setName(highlightKey);
        // Set initial scale to match cat exactly
        const highlightScale = catWidth / highlight.width;
        highlight.setScale(highlightScale);
        this.container.add(highlight);

        // Scale up animation for both highlights
        const scaleTween = this.scene.tweens.add({
            targets: [highlight, rotatingHighlight],
            scale: `*=1.2`,
            duration: 200,
            ease: 'Power2'
        });
        
        // Rotation animation
        const rotationTween = this.scene.tweens.add({
            targets: rotatingHighlight,
            angle: 360,
            duration: 500,
            ease: 'Linear'
        });

        // Mark cat as destroyed in game state
        this.gameStateManager.markCatDestroyed(index);

        // Destroy the cat immediately to prevent further clicks
        cat.destroy();

        // Remove from our tracking array
        this.cats = this.cats.filter(c => c !== cat);

        // Create a counter for completed animations
        let completedAnimations = 0;
        const totalAnimations = 2; // scale and rotation tweens

        const checkAnimationsComplete = () => {
            completedAnimations++;
            if (completedAnimations === totalAnimations) {
                // All tweens are complete, now start the destroy timer
                this.scene.time.delayedCall(500, () => { // Reduced from 1000 to 500 since we're waiting for tweens
                    highlight.destroy();
                    rotatingHighlight.destroy();
                    
                    // Now check if this was the last cat and trigger win state
                    if (this.gameStateManager.isAllCatsDestroyed()) {
                        this.gameStateManager.setGameState('win');
                    }
                });
            }
        };

        // Add completion callbacks to both tweens
        scaleTween.on('complete', checkAnimationsComplete);
        rotationTween.on('complete', checkAnimationsComplete);
    }

    cleanup() {
        // We don't need to destroy cats on cleanup anymore
        // Layout manager will handle repositioning
        // Just clear our reference array
        this.cats = [];
    }
} 