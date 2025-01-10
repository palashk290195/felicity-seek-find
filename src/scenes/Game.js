// Game.js
import * as Phaser from '../phaser/phaser-3.87.0-core.js';
import { handleCtaPressed, networkPlugin, adStart, adEnd } from "../networkPlugin.js";
import { config } from "../config.js";
import { GAME_CONFIG, getCurrentLanguage, getSceneBackground, getCurrentPositions } from "./utils/game-config.js";
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
            lastUpdateTime: 0,
            currentPositions: [] // Store current positions
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
        
        // Calculate header dimensions
        this.headerHeight = gameHeight * GAME_CONFIG.LAYOUT.HEADER_HEIGHT_RATIO;
        const containerWidth = gameWidth * 0.8;
        const containerHeight = this.headerHeight;

        const headerText = this.add.text(0, containerHeight/2, currentLanguage.TEXT.HEADER, {
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            fill: '#000000',
            align: 'center'
        }).setOrigin(0.5, 0.5);  // Center align the text

        fitTextToContainer(headerText, { 
            width: containerWidth, 
            height: containerHeight 
        }, currentLanguage.TEXT.HEADER);

        this.headerContainer.add([headerText]);
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
        // Update positions based on current orientation
        this.updateCurrentPositions();
        
        const duckContainerSize = Math.min(gameWidth, gameHeight) * GAME_CONFIG.LAYOUT.CHARACTER_CONTAINER_SIZE_RATIO;

        // Get background image's actual display dimensions and position
        const bgBounds = this.background.getBounds();
        const bgX = bgBounds.x;
        const bgY = bgBounds.y;
        const bgWidth = bgBounds.width;
        const bgHeight = bgBounds.height;

        this.ducks = this.state.currentPositions.map((pos, index) => {
            // Calculate position relative to background image
            const x = bgX + (bgWidth * pos.x);
            const y = bgY + (bgHeight * pos.y);
            
            const container = this.add.container(x, y);
            container.setSize(duckContainerSize, duckContainerSize);
            // Store position ratios relative to background
            container.setData('originalPosition', { 
                x: pos.x,
                y: pos.y,
                isRelativeToBackground: true 
            });

            // Create duck with correct state (found or not)
            if (this.state.foundDuckIndices.has(index)) {
                const coloredDuck = this.add.image(0, 0, GAME_CONFIG.COMMON_ASSETS.CHARACTER);
                fitImageToContainer(coloredDuck, container);
                container.add(coloredDuck);
            } else {
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
            if (this.pointerTween) {
                this.pointerTween.stop();
                this.pointerTween.remove();
                this.pointerTween = null;
            }
            this.pointer.destroy();
            this.pointer = null;
        }

        // Play initial click sound
        AudioUtils.playSound(this, GAME_CONFIG.COMMON_ASSETS.DUCK_CLICK_SOUND);

        const coloredDuck = this.add.image(0, 0, GAME_CONFIG.COMMON_ASSETS.CHARACTER);
        fitImageToContainer(coloredDuck, container);
        container.remove(duck);
        duck.destroy();
        container.add(coloredDuck);
        
        // Set the container's depth to be above other containers
        const TOP_LAYER_DEPTH = 1;
        container.setDepth(TOP_LAYER_DEPTH);

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
            const bgBounds = this.background.getBounds();
            const pointerX = bgBounds.x + (bgBounds.width * this.TARGET_DUCK_POSITION.x);
            const pointerY = bgBounds.y + (bgBounds.height * this.TARGET_DUCK_POSITION.y);
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

        // Update elapsed time
        this.updateElapsedTime();

        // Check if orientation changed and positions need updating
        const oldPositions = this.state.currentPositions;
        this.updateCurrentPositions();
        const positionsChanged = oldPositions !== this.state.currentPositions;

        if (positionsChanged) {
            // If positions changed, do full recreation
            this.tweens.killAll();
            this.destroySceneElements();
            this.createSceneElements();
        } else {
            // Otherwise, just update positions
            this.updateElementPositions(gameSize.width, gameSize.height);
        }
        
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

    updateCurrentPositions() {
        this.state.currentPositions = getCurrentPositions(this);
    }

    updateElementPositions(gameWidth, gameHeight) {
        // Update header height with new game height
        this.headerHeight = gameHeight * GAME_CONFIG.LAYOUT.HEADER_HEIGHT_RATIO;

        // Update header
        if (this.headerContainer) {
            this.headerContainer.setPosition(gameWidth / 2, 0);
            
            // Update header text size if needed
            const headerText = this.headerContainer.list[0];
            if (headerText) {
                headerText.setPosition(0, this.headerHeight/2);
                fitTextToContainer(headerText, {
                    width: gameWidth * 0.8,
                    height: this.headerHeight
                }, getCurrentLanguage().TEXT.HEADER);
            }
        }

        // Update background with new header height
        if (this.background && this.gameContainer) {
            // Update game container position with new header height
            this.gameContainer.setPosition(0, this.headerHeight);
            
            // Scale background using new dimensions and header height
            this.scaleBackground(
                gameWidth, 
                gameHeight, 
                gameHeight - this.headerHeight,  // new available height
                this.headerHeight                // new header height
            );
        }

        // Update ducks relative to background
        if (this.background) {
            const bgBounds = this.background.getBounds();
            const bgX = bgBounds.x;
            const bgY = bgBounds.y;
            const bgWidth = bgBounds.width;
            const bgHeight = bgBounds.height;

            this.ducks.forEach(container => {
                const pos = container.getData('originalPosition');
                if (pos.isRelativeToBackground) {
                    container.setPosition(
                        bgX + (bgWidth * pos.x),
                        bgY + (bgHeight * pos.y)
                    );
                    
                    // Update container size
                    const newSize = Math.min(gameWidth, gameHeight) * GAME_CONFIG.LAYOUT.CHARACTER_CONTAINER_SIZE_RATIO;
                    container.setSize(newSize, newSize);
                    
                    // Update duck scale
                    const duck = container.list[0];
                    if (duck) {
                        fitImageToContainer(duck, container);
                    }
                }
            });
        }

        // Update pointer with safety checks
        if (this.pointer && !this.pointer.destroyed) {
            const bgBounds = this.background.getBounds();
            const pointerX = bgBounds.x + (bgBounds.width * this.TARGET_DUCK_POSITION.x);
            const pointerY = bgBounds.y + (bgBounds.height * this.TARGET_DUCK_POSITION.y);
            const baseScale = Math.min(gameWidth, gameHeight) * 0.0002;
            
            this.pointer.setPosition(pointerX, pointerY)
                .setScale(baseScale);
            
            // Only update tween if it exists and is active
            if (this.pointerTween && !this.pointerTween.destroyed && this.pointerTween.isPlaying()) {
                try {
                    this.pointerTween.updateTo('scale', baseScale * 1.2, true);
                } catch (error) {
                    console.log('[Game] Pointer tween update failed:', error);
                    // Clean up invalid tween
                    this.pointerTween = null;
                }
            }
        }

        // Update play now button
        if (this.playNowButton) {
            const buttonY = gameHeight * GAME_CONFIG.SCENES.GAME.PLAY_BUTTON_Y;
            const buttonScale = Math.min(gameWidth, gameHeight) * GAME_CONFIG.LAYOUT.BUTTON_SCALE_RATIO;
            
            this.playNowButton
                .setPosition(gameWidth / 2, buttonY)
                .setScale(buttonScale);
        }
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