import { GAME_LAYOUT } from '../config/game-layout.js';
import { handleCtaPressed, adRetry } from "../networkPlugin.js";
import * as Phaser from '../phaser/phaser-3.87.0-core.js';
import { getCurrentLanguage } from '../scenes/utils/game-config.js';
import { fitTextToContainer } from '../scenes/utils/layout-utils.js';
import { GAME_CONFIG } from '../scenes/utils/game-config.js';
import { AudioUtils } from '../utils/audio-utils.js';

export class GameStateManager {
    constructor(scene) {
        this.scene = scene;
        this.clickedObjects = new Set();
        this.gameState = 'playing'; // 'playing' or 'win'
        this.winAnimations = [];
        this.bgRabbit = null;
        this.events = new Phaser.Events.EventEmitter();
        this.findTextTween = null; // Store the text tween reference
    }

    addClickedObject(object) {
        this.clickedObjects.add(object);
        this.events.emit('objectFound', object);
        
        if (this.isAllObjectsFound()) {
            this.setGameState('win');
        }
    }

    markObjectClicked(objectId) {
        this.clickedObjects.add(objectId);
        this.updateFoundObjectsCount();
        this.scene.findTextManager.decrementCount(this.clickedObjects.size);
    }

    isObjectClicked(objectId) {
        return this.clickedObjects.has(objectId);
    }

    isAllObjectsFound() {
        return this.clickedObjects.size === 6; // We need to find 6 objects
    }

    updateFoundObjectsCount() {
        // Update the counter text if it exists
        const counterText = this.scene['counter-text'];
        if (counterText) {
            counterText.setText(`${this.clickedObjects.size}/6`);
        }
    }

    setGameState(state) {
        if (this.gameState === state) return;
        
        this.gameState = state;
        if (state === 'win') {
            const mainContainer = this.scene['main-container'];
            if (mainContainer) {
                // Get the original position from layout
                const isLandscape = this.scene.scale.width > this.scene.scale.height;
                const containerConfig = GAME_LAYOUT.containers['main-container'];
                const originalX = isLandscape ? containerConfig.landscape.x : containerConfig.portrait.x;
                const originalY = isLandscape ? containerConfig.landscape.y : containerConfig.portrait.y;
                
                // Convert to pixel coordinates
                const targetX = originalX * this.scene.scale.width;
                const targetY = originalY * this.scene.scale.height;
                
                // Create tween to move container back
                this.scene.tweens.add({
                    targets: mainContainer,
                    x: targetX,
                    y: targetY,
                    duration: 500,
                    ease: 'Power2',
                    onComplete: () => {
                        this.startWinAnimations();
                    }
                });
            }
        }
    }

    startWinAnimations() {
        // Stop any existing animations
        this.stopWinAnimations();

        // Create and show BG-Rabbit with fall animation
        this.createBGRabbit();
    }

    createBGRabbit() {
        // Get the existing bg-rabbit from the layout
        this.bgRabbit = this.scene['bg-rabbit'];
        if (this.bgRabbit) {
            const gameHeight = this.scene.scale.height;

            // Position it above the screen
            this.bgRabbit.setPosition(this.bgRabbit.x, -2 * gameHeight);
            this.bgRabbit.setVisible(true);

            // Make it interactive if not already
            if (!this.bgRabbit.input) {
                this.bgRabbit.setInteractive();
                this.bgRabbit.on('pointerdown', () => {
                    adRetry();
                    handleCtaPressed();
                });
            }

            // Animate the rabbit falling
            const textBg = this.scene['text-bg'];
            const findText = this.scene.findTextManager.findText;
            if (textBg && findText) {
                textBg.setVisible(false);
                findText.setVisible(false);
            }
            this.scene.tweens.add({
                targets: this.bgRabbit,
                y: 0, // Move to center of screen
                duration: 1000, // 1 second duration
                ease: 'Power2',
                onComplete: () => {
                    this.centerFindText();
                    if (textBg && findText) {
                        textBg.setVisible(true);
                        findText.setVisible(true);
                    }
                    AudioUtils.playSound(this.scene, getCurrentLanguage().voiceoverKey);
                }
            });
        }
    }

    stopWinAnimations() {
        // Stop all existing win animations
        this.winAnimations.forEach(tween => {
            if (tween && tween.isPlaying()) {
                tween.stop();
            }
        });
        this.winAnimations = [];

        // Destroy BG-Rabbit if it exists
        if (this.bgRabbit) {
            this.bgRabbit.destroy();
            this.bgRabbit = null;
        }
    }

    handleResize() {
        // If in win state, reposition and rescale BG-Rabbit
        if (this.gameState === 'win' && this.bgRabbit) {
            this.bgRabbit.setVisible(true);
            this.centerFindText();
        }
        
    }

    centerFindText() {
        const textBg = this.scene['text-bg'];
        const findText = this.scene.findTextManager.findText;
        
        if (!textBg || !findText) return;

        // Stop existing tween if any
        if (this.findTextTween) {
            this.findTextTween.stop();
            this.findTextTween = null;
        }

        // Center text-bg
        const gameWidth = this.scene.scale.width;
        const gameHeight = this.scene.scale.height;
        
        // Set width to game width and scale height proportionally
        const originalWidth = textBg.width;
        const originalHeight = textBg.height;
        const scale = gameWidth / originalWidth;
        const aspectRatio = originalHeight / originalWidth;
        
        textBg.setScale(scale);
        textBg.setPosition(0,0);

        // Create a container with 80% of text-bg's display dimensions
        const container = {
            width: textBg.displayWidth * 0.8,
            height: textBg.displayHeight * 0.8
        };

        // Update find text
        const language = getCurrentLanguage();
        fitTextToContainer(findText, container, language.find_rabbits);
        findText.setText(language.find_rabbits);

        // Start tween for findText
        this.findTextTween = this.scene.tweens.add({
            targets: findText,
            scale: 0.8,
            duration: 1000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: Infinity
        });
    }
} 