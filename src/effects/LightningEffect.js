import { EffectHandler } from './EffectHandler.js';
import { GAME_CONFIG } from '../scenes/utils/game-config.js';
import * as Phaser from '../phaser/phaser-3.87.0-core.js';

class LightningStroke {
    constructor(scene, container, x, y, scale = 1, rotation = 0, alpha = 1) {
        this.sprite = scene.add.sprite(x, y, 'lightning');
        this.sprite.setOrigin(0, 0);
        this.sprite.setRotation(Phaser.Math.DegToRad(rotation));
        this.sprite.setAlpha(alpha);
        this.sprite.setDepth(1000);
        
        // Set the actual scale immediately
        if (typeof scale === 'object') {
            this.sprite.setScale(scale.x, scale.y);
        } else {
            this.sprite.setScale(scale);
        }

        // Create a mask to reveal the lightning
        const maskGraphics = scene.add.graphics();
        this.sprite.setMask(maskGraphics.createGeometryMask());
        
        // Calculate DPI-adjusted dimensions
        const dpiX = x / GAME_CONFIG.display.dpi;
        const dpiY = y / GAME_CONFIG.display.dpi;
        const dpiWidth = (this.sprite.width * this.sprite.scaleX) / GAME_CONFIG.display.dpi;
        const targetHeight = (this.sprite.height * this.sprite.scaleY) / GAME_CONFIG.display.dpi;
        
        // Start with empty mask
        maskGraphics.clear();
        maskGraphics.fillStyle(0xffffff);
        maskGraphics.fillRect(dpiX, dpiY, dpiWidth, 0);
        
        // Animate the mask height
        scene.tweens.add({
            targets: maskGraphics,
            height: targetHeight,
            duration: 400,
            ease: 'Cubic.easeOut',
            onUpdate: () => {
                maskGraphics.clear();
                maskGraphics.fillStyle(0xffffff);
                maskGraphics.fillRect(dpiX, dpiY, dpiWidth, maskGraphics.height);
            },
            onComplete: () => {
                // Remove mask after animation
                this.sprite.clearMask();
                maskGraphics.destroy();
            }
        });
        
        container.add(this.sprite);
    }

    destroy() {
        if (this.sprite) {
            this.sprite.destroy();
            this.sprite = null;
        }
    }
}

export class LightningEffect extends EffectHandler {
    constructor(scene) {
        super(scene, true);
        this.bgDark = null;
        this.strokes = [];
    }

    createStroke(container, x, y, scale, index = 0) {
        // Predefined angles for 5 strokes, evenly distributed from -30 to 30 degrees
        const angles = [-20, -35, 30, 10, 5];
        const rotation = angles[index % angles.length];
        
        const stroke = new LightningStroke(
            this.scene,
            container,
            x,
            y,
            scale,
            rotation
        );
        this.strokes.push(stroke);
    }

    trigger() {
        if (this.isActive) {
            return;
        }
        
        const mainContainer = this.scene['main-container'];
        this.bgDark = mainContainer.getByName('bg-dark');
        
        if (!this.bgDark) {
            console.warn('Lightning effect: bg-dark not found');
            return;
        }
        
        this.bgDark.setVisible(true);

        // Get the original lightning position from layout
        const originalLightning = mainContainer.getByName('lightning');
        if (!originalLightning) {
            console.warn('Lightning effect: Original lightning not found');
            return;
        }

        // Create strokes with delay, passing the index for angle selection
        for (let i = 0; i < 5; i++) {
            this.scene.time.delayedCall(i * 400, () => {
                this.createStroke(
                    mainContainer,
                    originalLightning.x,
                    originalLightning.y,
                    { x: originalLightning.scaleX, y: originalLightning.scaleY },
                    i  // Pass the index for angle selection
                );
            });
        }

        // Flash effect after all strokes are created
        this.scene.time.delayedCall(2200, () => {
            this.scene.tweens.add({
                targets: this.strokes.map(stroke => stroke.sprite),
                alpha: { from: 1, to: 0 },
                duration: 2000,
                ease: 'Stepped',
                easeParams: [3],
                onComplete: () => {
                    this.strokes.forEach(stroke => stroke.destroy());
                    this.strokes = [];
                }
            });
        });

        this.isActive = true;
    }

    handleResize() {
        if (this.isActive && this.bgDark) {
            this.bgDark.setVisible(true);
        }
    }

    cleanup() {
        this.strokes.forEach(stroke => stroke.destroy());
        this.strokes = [];
        this.isActive = false;
        super.cleanup();
    }
} 