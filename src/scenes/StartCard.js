// StartCard.js
import * as Phaser from '../phaser/phaser-3.87.0-core.js';
import { GAME_CONFIG, getCurrentLanguage, getSceneBackground } from './utils/game-config.js';
import { StartCardLayoutManager } from './utils/startcard-layout-manager.js';
import { fitImageToContainer, fitTextToContainer, createBackground } from './utils/layout-utils.js';
import { AudioUtils } from '../utils/audio-utils.js';
import { ImageFitter } from './utils/image-fitter.js';

export class StartCard extends Phaser.Scene {
    constructor() {
        super('StartCard');
        this.state = {
            animationStep: 'entry', // 'entry' | 'wiggle' | 'exit' | 'complete'
            sceneStartTime: 0,
            transitionTimerStarted: false
        };
        
        // Scene elements
        this.layoutManager = null;
        this.background = null;
        this.sceneTransitionTimer = null;
    }

    init() {
        // this.game.events.on('hidden', this.sound.onGameBlur, this);
        // this.game.events.on('visible', this.sound.onGameFocus, this);
    }

    logState(event = 'default') {
        console.log(`[StartCard][${event}]`, {
            state: this.state,
            dimensions: {
                width: this.scale.width,
                height: this.scale.height,
                isLandscape: this.scale.width > this.scale.height
            }
        });
    }

    create() {
        console.log('[StartCard][create] Initializing');
        this.state.sceneStartTime = this.time.now;
        this.createSceneElements();
        this.setupResizeHandler();
        this.startAnimationsFromState();
        this.setupSceneTransition();
        this.logState('create');
        // Setup audio handling
        const cleanup = AudioUtils.setup(this);
        this.events.once('shutdown', cleanup);
    }

    createSceneElements() {
        console.log('[StartCard][createSceneElements] Creating UI elements');
        
        // Create background
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;
        const backgroundKey = getSceneBackground('START_CARD');
        
        createBackground.call(this, gameWidth, gameHeight, backgroundKey);
        
        // Initialize layout manager and create containers
        this.layoutManager = new StartCardLayoutManager(this);
        this.createLayoutElements();
    }

    createLayoutElements() {
        const { text: textContainer, character: characterContainer, logo: logoContainer } = this.layoutManager.getContainers();
        const currentLanguage = getCurrentLanguage();
        
        // Create logo with glow effect
        const glow = this.add.image(0, 0, 'game_logo');
        glow.setBlendMode(Phaser.BlendModes.ADD);
        glow.setAlpha(0.4);
        glow.setTint(0xffff99); // Warm yellow glow
        ImageFitter.fitToContainer(glow, logoContainer, {
            scaleMode: ImageFitter.SCALE_MODE.FIT,
            maintainAspectRatio: true,
            widthPercentage: 0.85,
            heightPercentage: 0.85
        });
        
        const logo = this.add.image(0, 0, 'game_logo');
        logo.setAlpha(0.9);
        ImageFitter.fitToContainer(logo, logoContainer, {
            scaleMode: ImageFitter.SCALE_MODE.FIT,
            maintainAspectRatio: true,
            widthPercentage: 0.8,
            heightPercentage: 0.8
        });

        // Add both to container
        logoContainer.add([glow, logo]);

        // Add subtle pulse animation to the glow
        this.tweens.add({
            targets: glow,
            alpha: { from: 0.4, to: 0.6 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Create text
        const titleText = this.add.text(0, 0, currentLanguage.TEXT.TITLE, {
            fontFamily: 'Arial',
            fontSize: '32px',
            fontStyle: 'bold',
            color: '#000000'
        });
        fitTextToContainer(titleText, textContainer, currentLanguage.TEXT.TITLE);
        textContainer.add(titleText);

        // Create character
        const character = this.add.image(0, 0, GAME_CONFIG.COMMON_ASSETS.CHARACTER);
        fitImageToContainer(character, characterContainer);
        characterContainer.add(character);

        // Set initial position based on animation state
        this.positionCharacterForState();
    }

    positionCharacterForState() {
        const characterContainer = this.layoutManager.getContainer('character');
        if (!characterContainer) return;

        const width = this.scale.width;
        let startX;

        switch (this.state.animationStep) {
            case 'entry':
                startX = this.isLandscape() ? width * 0.9 : width * 1.5;
                break;
            case 'wiggle':
            case 'exit':
                startX = this.getTargetX();
                break;
            case 'complete':
                startX = -characterContainer.width;
                break;
            default:
                startX = this.isLandscape() ? width * 0.9 : width * 1.5;
        }

        characterContainer.setX(startX);
        console.log(`[StartCard][positionCharacter] Set X to ${startX} for state ${this.state.animationStep}`);
    }

    setupResizeHandler() {
        this.scale.on('resize', this.handleResize, this);
    }

    handleResize(gameSize) {
        console.log('[StartCard][resize] New dimensions:', gameSize);
        
        if (!this.scene.isActive('StartCard')) return;

        // Stop all current animations
        this.tweens.killAll();

        // Destroy and recreate all UI elements
        this.destroySceneElements();
        this.createSceneElements();

        // Restart animations from current state
        this.startAnimationsFromState();
        
        this.logState('resize');
    }

    destroySceneElements() {
        console.log('[StartCard][destroySceneElements] Cleaning up UI');
        
        this.layoutManager?.destroy();
        this.layoutManager = null;
        
        // Clear all existing game objects
        this.children.removeAll(true);
    }

    startAnimationsFromState() {
        const characterContainer = this.layoutManager.getContainer('character');
        if (!characterContainer) return;

        const { ENTRY_DURATION, WIGGLE_DURATION, EXIT_DURATION } = GAME_CONFIG.SCENES.START_CARD;

        switch (this.state.animationStep) {
            case 'entry':
                this.startEntryAnimation();
                break;
            case 'wiggle':
                characterContainer.setX(this.getTargetX());
                this.startWiggleAnimation();
                break;
            case 'exit':
                characterContainer.setX(this.getTargetX());
                this.startExitAnimation();
                break;
            case 'complete':
                characterContainer.setX(-characterContainer.width);
                break;
        }
    }

    startEntryAnimation() {
        const characterContainer = this.layoutManager.getContainer('character');
        const { ENTRY_DURATION } = GAME_CONFIG.SCENES.START_CARD;

        this.tweens.add({
            targets: characterContainer,
            x: this.getTargetX(),
            duration: ENTRY_DURATION,
            ease: 'Power2',
            onComplete: () => {
                this.state.animationStep = 'wiggle';
                this.startWiggleAnimation();
            }
        });
    }

    startWiggleAnimation() {
        const characterContainer = this.layoutManager.getContainer('character');
        const { WIGGLE_DURATION } = GAME_CONFIG.SCENES.START_CARD;
        const targetX = this.getTargetX();

        this.tweens.add({
            targets: characterContainer,
            x: targetX - 10,
            duration: WIGGLE_DURATION,
            yoyo: true,
            repeat: 1,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.state.animationStep = 'exit';
                this.startExitAnimation();
            }
        });
    }

    startExitAnimation() {
        const characterContainer = this.layoutManager.getContainer('character');
        const { EXIT_DURATION } = GAME_CONFIG.SCENES.START_CARD;

        this.tweens.add({
            targets: characterContainer,
            x: -characterContainer.width,
            duration: EXIT_DURATION,
            ease: 'Power2',
            onComplete: () => {
                this.state.animationStep = 'complete';
            }
        });
    }

    setupSceneTransition() {
        const { SCENE_DURATION } = GAME_CONFIG.SCENES.START_CARD;
        const elapsedTime = this.time.now - this.state.sceneStartTime;
        const remainingTime = Math.max(0, SCENE_DURATION - elapsedTime);

        console.log(`[StartCard][setupSceneTransition] Elapsed: ${elapsedTime}, Remaining: ${remainingTime}`);

        // Only start the transition timer if not already started
        if (!this.state.transitionTimerStarted) {
            this.sceneTransitionTimer = this.time.delayedCall(remainingTime, () => {
                console.log('[StartCard] Transitioning to Game scene');
                this.scene.start('Game');
            });
            this.state.transitionTimerStarted = true;
        }
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