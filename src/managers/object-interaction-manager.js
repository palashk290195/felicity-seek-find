import * as Phaser from '../phaser/phaser-3.87.0-core.js';
import { EffectManager } from '../effects/EffectManager.js';
import { GAME_CONFIG } from '../scenes/utils/game-config.js';
import { SpiderEffect } from '../effects/SpiderEffect.js';
import { LampHighlightEffect } from '../effects/LampHighlightEffect.js';
import { OrangeLightEffect } from '../effects/OrangeLightEffect.js';
import { HandEffect } from '../effects/HandEffect.js';
import { HorrorCharacterEffect } from '../effects/HorrorCharacterEffect.js';
import { LightningEffect } from '../effects/LightningEffect.js';
import { AudioUtils } from '../utils/audio-utils.js';

export class ObjectInteractionManager {
    constructor(scene, gameStateManager) {
        this.scene = scene;
        this.gameStateManager = gameStateManager;
        this.findObjects = [];
        this.container = this.scene['main-container'];
        this.dragListenerSet = false;
        this.effectManager = new EffectManager(scene);
        
        // Register effects
        this.effectManager.registerEffect('object-1-effect', new OrangeLightEffect(scene));
        this.effectManager.registerEffect('object-2-effect', new HandEffect(scene));
        this.effectManager.registerEffect('object-3-effect', new LightningEffect(scene));
        this.effectManager.registerEffect('object-4-effect', new SpiderEffect(scene));
        this.effectManager.registerEffect('object-5-effect', new HorrorCharacterEffect(scene));
        this.effectManager.registerEffect('object-6-effect', new LampHighlightEffect(scene));
        
        this.setupFindObjects();
    }

    setupFindObjects() {
        // Setup all 6 find-objects with interaction
        for (let i = 1; i <= 6; i++) {
            // Skip if object was already clicked
            if (this.gameStateManager.isObjectClicked(i)) {
                // Make sure the object is destroyed if it exists
                const existingObject = this.container.getByName(`find-object${i}`);
                if (existingObject) {
                    existingObject.destroy();
                }
                continue;
            }

            const objectName = `find-object${i}`;
            const findObject = this.container.getByName(objectName);
            if (findObject) {
                findObject.setInteractive({ useHandCursor: true });
                    //.setBlendMode(Phaser.BlendModes.ADD)
                    //.setAlpha(0.7)
                if (i === 4) {
                    findObject.setTint(0x8090ff); // Bluish tint for object 4
                } else {
                    findObject.setTint(0x000099); // Making the tint slightly less dark than this for all other objects
                }
                findObject.on('pointerdown', () => this.handleObjectClick(i, findObject));
                this.findObjects.push(findObject);
            } else {
                console.log(`OBJECT_SETUP_MISSING: Object ${i} not found for interaction setup`);
            }
        }
    }

    handleObjectClick(index, findObject) {
        console.log(`Object ${index} clicked`);
        
        // Play click sound
        AudioUtils.playSound(this.scene, 'object-click', false);
        
        // Hide hint immediately on any object click
        if (this.scene.hintManager) {
            this.scene.hintManager.pauseHint();
        }

        // Get object position relative to scene
        const worldPos = findObject.getWorldTransformMatrix();
        const x = worldPos.tx;
        const y = worldPos.ty;

        // Trigger appropriate effect based on object index
        console.log(`Triggering effect: object-${index}-effect`);
        this.effectManager.triggerEffect(`object-${index}-effect`, x, y);

        // Create move up and fade out animation
        this.scene.tweens.add({
            targets: findObject,
            y: findObject.y - Math.min(this.scene.scale.width, this.scene.scale.height) * 0.1,
            alpha: 0,
            duration: 0,
            ease: 'Power2',
            onComplete: () => {
                // Mark object as clicked in game state
                this.gameStateManager.markObjectClicked(index);
                
                // Notify hint manager about object click
                if (this.scene.hintManager) {
                    this.scene.hintManager.handleObjectClick(index);
                }
                
                // Destroy the object
                findObject.destroy();
                
                // Remove from our tracking array
                this.findObjects = this.findObjects.filter(obj => obj !== findObject);
                
                // Check if this was the last object and trigger win state
                if (this.gameStateManager.isAllObjectsFound()) {
                    this.gameStateManager.setGameState('win');
                } else {
                    // Schedule hint resume after delay using tween instead of delayedCall
                    if (this.scene.hintManager) {
                        this.scene.hintManager.scheduleResume();
                    }
                }
            }
        });
    }

    cleanup() {
        // Clear objects array
        this.findObjects = [];
        
        // Kill all tweens
        if (this.scene && this.scene.tweens) {
            this.scene.tweens.killAll();
        }

        // Clear all pending timers
        if (this.scene && this.scene.time) {
            this.scene.time.removeAllEvents();
        }

        // Let effects handle their own restart after resize
        this.effectManager.handleResize();

        this.setupFindObjects();
    }
} 