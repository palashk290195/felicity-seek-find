// scenes/StartCard.js

import * as Phaser from '../phaser/phaser-3.87.0-core.js';
import { GAME_CONFIG, getCurrentLanguage, getSceneBackground } from './utils/game-config.js';
import { StartCardLayoutManager } from './utils/startcard-layout-manager.js';
import { fitImageToContainer, fitTextToContainer, createBackground } from './utils/layout-utils.js';

export class StartCard extends Phaser.Scene {
    constructor() {
        super('StartCard');
    }

    create() {
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;
        
        // Get current language and theme configurations
        const currentLanguage = getCurrentLanguage();
        const backgroundKey = getSceneBackground('START_CARD');
        
        // Create background with current theme
        createBackground.call(this, gameWidth, gameHeight, backgroundKey);
        
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
        const currentLanguage = getCurrentLanguage();
        
        // Create text using language-specific content
        this.titleText = this.add.text(0, 0, currentLanguage.TEXT.TITLE, {
            fontFamily: 'Arial',
            fontSize: '32px',
            fontStyle: 'bold',
            color: '#000000'
        });
        fitTextToContainer(this.titleText, textContainer, currentLanguage.TEXT.TITLE);
        textContainer.add(this.titleText);

        // Create character using language-specific asset
        this.character = this.add.image(0, 0, GAME_CONFIG.COMMON_ASSETS.CHARACTER);
        fitImageToContainer(this.character, characterContainer);
        characterContainer.add(this.character);

        // Move character off-screen initially
        const startX = this.isLandscape() 
            ? this.scale.width * 0.9  // Landscape
            : this.scale.width * 1.5;  // Portrait
        characterContainer.setX(startX);
    }

    startAnimations() {
        const { ENTRY_DURATION, WIGGLE_DURATION } = GAME_CONFIG.SCENES.START_CARD;
        
        // Entry animation
        this.tweens.add({
            targets: this.layoutManager.getContainer('character'),
            x: this.getTargetX(),
            duration: ENTRY_DURATION,
            ease: 'Power2',
            onComplete: () => this.startWiggleAnimation()
        });
    }

    startWiggleAnimation() {
        const { WIGGLE_DURATION, EXIT_DURATION } = GAME_CONFIG.SCENES.START_CARD;
        const targetX = this.getTargetX();
        
        this.tweens.add({
            targets: this.layoutManager.getContainer('character'),
            x: targetX - 10,
            duration: WIGGLE_DURATION,
            yoyo: true,
            repeat: 1,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                // Move character off the left side of the screen
                this.tweens.add({
                    targets: this.layoutManager.getContainer('character'),
                    x: -this.layoutManager.getContainer('character').width,
                    duration: EXIT_DURATION,
                    ease: 'Power2'
                });
            }
        });
    }

    setupSceneTransition() {
        const { SCENE_DURATION } = GAME_CONFIG.SCENES.START_CARD;
        
        // Transition to Game scene after duration
        this.time.delayedCall(SCENE_DURATION, () => {
            this.scene.start('Game');
        });
    }

    isLandscape() {
        return this.scale.width > this.scale.height;
    }

    getTargetX() {
        const width = this.scale.width;
        const { CHARACTER } = GAME_CONFIG.SCENES.START_CARD;
        
        return this.isLandscape()
            ? width * CHARACTER.LANDSCAPE.X
            : width * CHARACTER.PORTRAIT.X;
    }
}