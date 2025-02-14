export class ObjectInteractionManager {
    constructor(scene, gameStateManager) {
        this.scene = scene;
        this.gameStateManager = gameStateManager;
        this.cats = [];
        this.highlights = [];
        this.container = this.scene['main-container'];
        this.setupCats();
    }

    setupKeysAndContainer() {
        // Make container interactive
        if (this.container) {
            this.container.setInteractive();
        }

        // Make all keys interactive and start their animations
        this.startKeyAnimations();
    }

    startKeyAnimations(currentKeyIndex = 1) {
        const key = this.scene[`find-key-${currentKeyIndex}`];
        if (!key) {
            // If current key doesn't exist, try starting from beginning
            if (currentKeyIndex === 1) {
                return; // If we're already at 1 and it doesn't exist, stop
            }
            this.startKeyAnimations(1);
            return;
        }

        // Make key interactive if it exists
        key.setInteractive();

        // Create the combined scale and rotation animation
        let animationCount = 0;
        const totalAnimations = 2; // Run animation twice

        const createKeyAnimation = () => {
            // Scale up and rotate
            this.scene.tweens.add({
                targets: key,
                scaleX: key.scaleX * 1.2,
                scaleY: key.scaleY * 1.2,
                angle: '+=45',
                duration: 300,
                yoyo: true,
                ease: 'Quad.easeOut',
                onComplete: () => {
                    animationCount++;
                    if (animationCount < totalAnimations) {
                        // Add delay before second animation of same key
                        this.scene.time.delayedCall(1000, () => {
                            createKeyAnimation();
                        });
                    } else {
                        // Add delay before starting next key
                        this.scene.time.delayedCall(1000, () => {
                            const nextKeyIndex = currentKeyIndex + 1;
                            this.startKeyAnimations(nextKeyIndex > 4 ? 1 : nextKeyIndex);
                        });
                    }
                }
            });
        };

        // Start the animation for current key
        createKeyAnimation();
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
        // Clear cats array
        this.cats = [];
        
        // Kill all tweens
        if (this.scene && this.scene.tweens) {
            this.scene.tweens.killAll();
        }

        // Clear all pending timers
        if (this.scene && this.scene.time) {
            this.scene.time.removeAllEvents();
        }

        // Restart key animations
        this.setupKeysAndContainer();
    }
} 