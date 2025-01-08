// Game.js
import * as Phaser from '../phaser/phaser-3.87.0-core.js';
import { handleCtaPressed, networkPlugin, adStart, adEnd } from "../networkPlugin.js";
import { config } from "../config.js";
import { GAME_CONFIG, getCurrentLanguage, getSceneBackground } from "./utils/game-config.js";
import { fitImageToContainer, fitTextToContainer } from "./utils/layout-utils.js";
import { AudioUtils } from '../utils/audio-utils.js';

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
        
        // Constants from config
        this.TARGET_DUCK_POSITION = GAME_CONFIG.SCENES.GAME.TARGET_POSITION;
        this.GAME_DURATION = GAME_CONFIG.SCENES.GAME.DURATION;
        this.DUCKS_TO_FIND = GAME_CONFIG.SCENES.GAME.DUCKS_TO_FIND;

        // Game state
        this.state = {
            ducksFound: 0,
            foundDuckIndices: new Set(),
            gameStartTime: 0,
            elapsedTime: 0,
            headerShown: false,
            lastUpdateTime: 0
        };

        // Scene elements
        this.headerHeight = 0;
        this.background = null;
        this.ducks = [];
        this.pointer = null;
        this.pointerTween = null;
        this.playNowButton = null;
        this.headerContainer = null;
        this.gameContainer = null;
    }

    logState(event = 'default') {
        console.log(`[Game][${event}]`, {
            state: this.state,
            dimensions: {
                width: this.scale.width,
                height: this.scale.height,
                headerHeight: this.headerHeight
            },
            elements: {
                ducksCount: this.ducks.length,
                hasPointer: !!this.pointer,
                hasMusic: !!this.suspenseTheme
            }
        });
    }

    create() {
        console.log('[Game][create] Initializing');
        
        // Set overall background to white first
        this.cameras.main.setBackgroundColor('#ffffff');
        
        // Start game state
        this.state.gameStartTime = this.time.now;
        this.state.lastUpdateTime = this.time.now;
        
        this.createSceneElements();
        this.setupResizeHandler();

        // Setup audio handling
        const cleanup = AudioUtils.setup(this);

        // Clean up when scene shuts down
        this.events.once('shutdown', cleanup);
        
        // Setup background music
        this.setupBackgroundMusic();
        
        this.logState('create');
    }

    createSceneElements() {
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;

        this.createHeader(gameWidth, gameHeight);
        this.createBackground(gameWidth, gameHeight);
        this.createDucks(gameWidth, gameHeight);
        this.createPointer(gameWidth, gameHeight);
        this.createPlayNowButton(gameWidth, gameHeight);
    }

    createHeader(gameWidth, gameHeight) {
        this.headerContainer = this.add.container(gameWidth / 2, 0);
        const currentLanguage = getCurrentLanguage();
        
        const containerWidth = gameWidth * 0.8;
        const containerHeight = gameHeight * GAME_CONFIG.LAYOUT.HEADER_HEIGHT_RATIO;

        const headerText = this.add.text(0, 0, currentLanguage.TEXT.HEADER, {
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            fill: '#000000'
        }).setOrigin(0.5, 0);

        fitTextToContainer(headerText, { 
            width: containerWidth, 
            height: containerHeight 
        }, currentLanguage.TEXT.HEADER);

        this.headerContainer.add([headerText]);
        this.headerHeight = this.headerContainer.getBounds().height;
        this.state.headerShown = true;

        // Animate header
        this.tweens.add({
            targets: headerText,
            scale: { from: 0, to: 1 },
            duration: 1000,
            ease: 'Power2'
        });
    }

    createBackground(gameWidth, gameHeight) {
        const topSpace = this.headerHeight;
        
        // Create game container for content below header
        this.gameContainer = this.add.container(0, topSpace);
        
        // Add main background image
        this.background = this.add.image(
            gameWidth / 2, 
            (gameHeight - topSpace) / 2 + topSpace, 
            getSceneBackground('GAME')
        ).setOrigin(0.5);
        
        this.gameContainer.add(this.background);
        this.scaleBackground(gameWidth, gameHeight, gameHeight - topSpace, this.headerHeight);
    }

    scaleBackground(width, gameHeight, availableHeight, headerHeight) {
        const scaleX = width / this.background.width;
        const scaleY = availableHeight / this.background.height;
        const scale = Math.max(scaleX, scaleY);
        
        this.background.setScale(scale);
        this.background.setOrigin(0.5, 0);
        this.background.setPosition(width/2, 0);
    }

    createDucks(gameWidth, gameHeight) {
        const duckPositions = GAME_CONFIG.SCENES.GAME.CHARACTER_POSITIONS;
        const duckContainerSize = Math.min(gameWidth, gameHeight) * GAME_CONFIG.LAYOUT.CHARACTER_CONTAINER_SIZE_RATIO;

        this.ducks = duckPositions.map((pos, index) => {
            const container = this.add.container(gameWidth * pos.x, gameHeight * pos.y);
            container.setSize(duckContainerSize, duckContainerSize);

            // Create duck with correct state (found or not)
            if (this.state.foundDuckIndices.has(index)) {
                // Create colored duck for found ones
                const coloredDuck = this.add.image(0, 0, GAME_CONFIG.COMMON_ASSETS.CHARACTER);
                fitImageToContainer(coloredDuck, container);
                container.add(coloredDuck);
            } else {
                // Create outline duck for unfound ones
                const duck = this.add.image(0, 0, GAME_CONFIG.COMMON_ASSETS.CHARACTER_OUTLINE);
                fitImageToContainer(duck, container);
                container.add(duck);
                duck.setInteractive();
                duck.on('pointerdown', () => this.handleDuckClick(container, duck, index));
            }

            return container;
        });
    }

    handleDuckClick(container, duck, index) {
        if (this.pointer) {
            this.pointer.destroy();
            this.pointerTween?.stop();
        }

        // Play initial click sound
        AudioUtils.playSound(this, GAME_CONFIG.COMMON_ASSETS.DUCK_CLICK_SOUND);

        const coloredDuck = this.add.image(0, 0, GAME_CONFIG.COMMON_ASSETS.CHARACTER);
        fitImageToContainer(coloredDuck, container);
        container.remove(duck);
        duck.destroy();
        container.add(coloredDuck);

        // Add particles
        const particles = this.add.particles(container.x, container.y, 'star', {
            speed: 30,
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            maxParticles: 10,
            lifespan: 1000
        });

        // Update state
        this.state.ducksFound++;
        this.state.foundDuckIndices.add(index);

        // Create bounce animation
        this.createBounceAnimation(container, () => {
            if (this.state.ducksFound >= this.DUCKS_TO_FIND) {
                this.scene.start('MidCard');
            }
        });
    }

    createBounceAnimation(container, onComplete) {
        const config = GAME_CONFIG.SCENES.GAME.CHARACTER_ANIMATION;
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;
        const startX = container.x;
        const startY = container.y;
        
        // Determine direction based on position
        const isRightHalf = startX > gameWidth / 2;
        const direction = isRightHalf ? 1 : -1;
        
        // Create bounce tweens array
        const tweens = [];
        let currentHeight = gameHeight * config.BOUNCE_HEIGHT;
        
        // First add the bounces in place
        for (let i = 0; i < config.BOUNCE_COUNT; i++) {
            // Up movement
            tweens.push({
                y: startY - currentHeight,
                duration: config.EXIT_DURATION / (config.BOUNCE_COUNT * 3),
                ease: 'Sine.Out'
            });
            
            // Down movement with small anticipation
            tweens.push({
                y: {
                    value: startY,
                    duration: config.EXIT_DURATION / (config.BOUNCE_COUNT * 3),
                    ease: 'Power2.Out'
                },
                scaleY: {
                    value: 0.8,
                    duration: 50,
                    yoyo: true,
                    ease: 'Quad.Out'
                },
                onComplete: () => {
                    // Play sound when object hits the ground
                    AudioUtils.playSound(this, config.BOUNCE_SOUND);
                }
            });

            // Reduce height for next bounce
            currentHeight *= config.BOUNCE_DECAY;
        }

        // Finally add the exit movement with smooth acceleration
        tweens.push({
            x: direction > 0 ? gameWidth + 100 : -100,
            duration: config.EXIT_DURATION / 3,
            ease: 'Power1.In'
        });

        // Create the chain
        this.tweens.chain({
            targets: container,
            tweens: tweens,
            onComplete: onComplete
        });
    }

    createPointer(gameWidth, gameHeight) {
        // Only create pointer if we haven't found any ducks yet
        if (this.state.ducksFound === 0) {
            const pointerX = gameWidth * this.TARGET_DUCK_POSITION.x;
            const pointerY = gameHeight * this.TARGET_DUCK_POSITION.y;
            const baseScale = Math.min(gameWidth, gameHeight) * 0.0002;
            
            this.pointer = this.add.image(pointerX, pointerY, 'Cursor_1')
                .setScale(baseScale)
                .setDepth(2)
                .setOrigin(0, 0);
            
            this.pointerTween = this.tweens.add({
                targets: this.pointer,
                scale: baseScale * 1.2,
                duration: 600,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }

    createPlayNowButton(gameWidth, gameHeight) {
        const currentLanguage = getCurrentLanguage();
        const buttonY = gameHeight * GAME_CONFIG.SCENES.GAME.PLAY_BUTTON_Y;
        
        this.playNowButton = this.add.image(gameWidth / 2, buttonY, currentLanguage.ASSETS.PLAY_NOW)
            .setInteractive()
            .setDepth(3);

        const playNowButtonScale = Math.min(gameWidth, gameHeight) * GAME_CONFIG.LAYOUT.BUTTON_SCALE_RATIO;
        this.playNowButton.setScale(playNowButtonScale);

        this.playNowButton.on('pointerdown', () => {
            handleCtaPressed();
            adEnd();
        });

        this.tweens.add({
            targets: this.playNowButton,
            scale: { from: 0, to: playNowButtonScale },
            duration: 1000,
            ease: 'Power2'
        });
    }

    setupBackgroundMusic() {
        AudioUtils.playSound(this, GAME_CONFIG.COMMON_ASSETS.BG_MUSIC, {
            loop: true,
            volume: GAME_CONFIG.AUDIO.BG_MUSIC_VOLUME
        });
    }

    setupResizeHandler() {
        this.scale.on('resize', this.handleResize, this);
    }

    handleResize(gameSize) {
        console.log('[Game][resize] New dimensions:', gameSize);
        
        if (!this.scene.isActive('Game')) {
            console.log('[Game][resize] Scene not active, skipping resize');
            return;
        }

        // Update elapsed time before recreating
        this.updateElapsedTime();

        // Stop all animations except audio
        this.tweens.killAll();

        // Destroy and recreate all UI elements
        this.destroySceneElements();
        this.createSceneElements();
        
        this.logState('resize');
    }

    destroySceneElements() {
        console.log('[Game][destroySceneElements] Cleaning up');
        
        // Clean up all elements except audio
        this.headerContainer?.destroy();
        this.gameContainer?.destroy();
        this.pointer?.destroy();
        this.playNowButton?.destroy();
        this.ducks.forEach(duck => duck.destroy());
        this.ducks = [];
        
        // Clear all existing game objects except audio
        this.children.getAll().forEach(child => {
            if (!(child instanceof Phaser.Sound.WebAudioSound || 
                  child instanceof Phaser.Sound.HTML5AudioSound)) {
                child.destroy();
            }
        });
    }

    updateElapsedTime() {
        const currentTime = this.time.now;
        this.state.elapsedTime += currentTime - this.state.lastUpdateTime;
        this.state.lastUpdateTime = currentTime;
    }

    update() {
        // Update elapsed time
        this.updateElapsedTime();

        // Check for game timer completion
        if (this.state.elapsedTime >= this.GAME_DURATION * 1000) {
            this.scene.start('EndCard');
        }
    }
}