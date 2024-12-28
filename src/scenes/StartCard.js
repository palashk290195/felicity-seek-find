// scenes/StartCard.js

import * as Phaser from '../phaser/phaser-3.87.0-core.js';
import { GAME_CONFIG } from './utils/game-config.js';
import { StartCardLayoutManager } from './utils/startcard-layout-manager.js';
import { fitImageToContainer, fitTextToContainer, createBackground } from './utils/layout-utils.js';

export class StartCard extends Phaser.Scene {
    constructor() {
        super('StartCard');
    }

    create() {
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;
        createBackground.call(this,gameWidth, gameHeight, 'VideoBG');
        this.setupScene();
        this.createSceneElements();
        this.startAnimations();
        this.setupSceneTransition();
    }

    setupScene() {
        
        // Initialize layout manager
        this.layoutManager = new StartCardLayoutManager(this);
    }

    createSceneElements() {
        const { text: textContainer, character: characterContainer } = this.layoutManager.getContainers();
        
        // Create text
        this.titleText = this.add.text(0, 0, GAME_CONFIG.START_CARD.TEXT.CONTENT.en, {
            fontFamily: 'Arial',
            fontSize: '32px',
            fontStyle: 'bold',
            color: '#000000'
        });
        fitTextToContainer(this.titleText, textContainer, GAME_CONFIG.START_CARD.TEXT.CONTENT.en);
        textContainer.add(this.titleText);

        // Create character
        this.character = this.add.image(0, 0, 'duck_colored');
        fitImageToContainer(this.character, characterContainer);
        characterContainer.add(this.character);

        // Move character off-screen initially
        const startX = this.isLandscape() 
            ? this.scale.width * 0.9  // Landscape
            : this.scale.width * 1.5;  // Portrait
        characterContainer.setX(startX);
    }

    startAnimations() {
        // Entry animation
        this.tweens.add({
            targets: this.layoutManager.getContainer('character'),
            x: this.getTargetX(),
            duration: GAME_CONFIG.START_CARD.ENTRY_DURATION,
            ease: 'Power2',
            onComplete: () => this.startWiggleAnimation()
        });
    }

    startWiggleAnimation() {
        const targetX = this.getTargetX();
        
        this.tweens.add({
            targets: this.layoutManager.getContainer('character'),
            x: targetX - 10,
            duration: GAME_CONFIG.START_CARD.WIGGLE_DURATION,
            yoyo: true,
            repeat: 1,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                // Move character off the left side of the screen
                this.tweens.add({
                    targets: this.layoutManager.getContainer('character'),
                    x: -this.layoutManager.getContainer('character').width, // Move completely off-screen
                    duration: GAME_CONFIG.START_CARD.EXIT_DURATION, // Adjust duration as needed
                    ease: 'Power2'
                });
            }
        });
    }

    setupSceneTransition() {
        // Transition to Game scene after duration
        this.time.delayedCall(GAME_CONFIG.START_CARD.SCENE_DURATION, () => {
            this.scene.start('Game');
        });
    }

    isLandscape() {
        return this.scale.width > this.scale.height;
    }

    getTargetX() {
        const width = this.scale.width;
        return this.isLandscape()
            ? width * GAME_CONFIG.START_CARD.CHARACTER.LANDSCAPE.X
            : width * GAME_CONFIG.START_CARD.CHARACTER.PORTRAIT.X;
    }
}