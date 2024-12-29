import * as Phaser from '../phaser/phaser-3.87.0-core.js';

import { handleCtaPressed, networkPlugin, adStart, adEnd, adClose, adRetry } from "../networkPlugin.js";
import { config } from "../config.js";
import { GAME_CONFIG, getCurrentLanguage, getSceneBackground } from "./utils/game-config.js";
import { fitImageToContainer, fitTextToContainer } from "./utils/layout-utils.js";

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
        // Use config values instead of hardcoded
        this.TARGET_DUCK_POSITION = GAME_CONFIG.SCENES.GAME.TARGET_POSITION;
        this.GAME_DURATION = GAME_CONFIG.SCENES.GAME.DURATION;
        this.DUCKS_TO_FIND = GAME_CONFIG.SCENES.GAME.DUCKS_TO_FIND;
        this.ducksFound = 0;
        this.gameTimer = null;
        this.headerHeight = 0;
        this.suspenseTheme = null;
    }

    init() {
        console.log('%cSCENE::Game', 'color: #fff; background: #f0f;');
    }

    editorCreate() {
        this.cameras.main.setBackgroundColor('#ffffff');
        
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;
    
        this.createHeader(gameWidth, gameHeight);
        this.createBackground(gameWidth, gameHeight);
        
        this.createDucks(gameWidth, gameHeight);
        this.createPointer(gameWidth, gameHeight);
        this.createPlayNowButton(gameWidth, gameHeight);
        this.startGameTimer();
    }
    
    startGameTimer() {
        this.gameTimer = this.time.addEvent({
            delay: this.GAME_DURATION * 1000,
            callback: () => this.scene.start('EndCard'),
            callbackScope: this
        });
    }
    
    createPointer(gameWidth, gameHeight) {
        const pointerX = gameWidth * this.TARGET_DUCK_POSITION.x;
        const pointerY = gameHeight * this.TARGET_DUCK_POSITION.y;
        
        const baseScale = Math.min(gameWidth, gameHeight) * 0.0002;
        
        this.pointer = this.add.image(pointerX, pointerY, 'Cursor_1')
            .setScale(baseScale)
            .setDepth(2)
            .setOrigin(0,0);
        
        this.pointerTween = this.tweens.add({
            targets: this.pointer,
            scale: baseScale * 1.2,
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    scaleBackground(width, gameHeight, availableHeight, headerHeight) {
        const scaleX = width / this.background.width;
        const scaleY = availableHeight / this.background.height;
        const scale = Math.max(scaleX, scaleY);
        
        this.background.setScale(scale);
        this.background.setOrigin(0.5,0);
        this.background.setPosition(width/2, 0);
    }
    
    createBackground(gameWidth, gameHeight) {
        const headerHeight = this.headerHeight;
        const topSpace = headerHeight;
        
        this.gameContainer = this.add.container(0, topSpace);
        
        this.background = this.add.image(gameWidth / 2, (gameHeight - topSpace) / 2 + topSpace, getSceneBackground('GAME'))
            .setOrigin(0.5);
        this.gameContainer.add(this.background);
        
        this.scaleBackground(gameWidth, gameHeight, gameHeight - topSpace, headerHeight);
    }
    
    createHeader(gameWidth, gameHeight) {
        const headerContainer = this.add.container(gameWidth / 2, 0);
        const currentLanguage = getCurrentLanguage();
        
        const containerWidth = gameWidth * 0.8;
        const containerHeight = gameHeight * GAME_CONFIG.LAYOUT.HEADER_HEIGHT_RATIO;

        const headerText = this.add.text(0, 0, currentLanguage.TEXT.HEADER, {
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            fill: '#000000'
        }).setOrigin(0.5, 0);
    
        fitTextToContainer(headerText, { width: containerWidth, height: containerHeight }, currentLanguage.TEXT.HEADER);
    
        headerContainer.add([headerText]);
        this.headerHeight = headerContainer.getBounds().height;
    
        this.tweens.add({
            targets: headerText,
            scale: { from: 0, to: 1 },
            duration: 1000,
            ease: 'Power2'
        });
    }
    
    createDucks(gameWidth, gameHeight) {
        const currentLanguage = getCurrentLanguage();
        const duckPositions = GAME_CONFIG.SCENES.GAME.CHARACTER_POSITIONS;
        const duckContainerSize = Math.min(gameWidth, gameHeight) * GAME_CONFIG.LAYOUT.CHARACTER_CONTAINER_SIZE_RATIO;

        this.ducks = duckPositions.map(pos => {
            const container = this.add.container(gameWidth * pos.x, gameHeight * pos.y);
            container.setSize(duckContainerSize, duckContainerSize);

            const duck = this.add.image(0, 0, GAME_CONFIG.COMMON_ASSETS.CHARACTER_OUTLINE);
            fitImageToContainer(duck, container);
            container.add(duck);
            duck.setInteractive();
            duck.on('pointerdown', () => this.handleDuckClick(container, duck));

            return container;
        });
    }
    
    handleDuckClick(container, duck) {
        const currentLanguage = getCurrentLanguage();
        
        if (this.pointer) {
            this.pointer.destroy();
            this.pointerTween.stop();
        }

        try {
            const sound = this.sound.add(GAME_CONFIG.COMMON_ASSETS.DUCK_CLICK_SOUND);
            sound.play();
        } catch (error) {
            console.error('Audio decode error:', error);
        }

        const coloredDuck = this.add.image(0, 0, GAME_CONFIG.COMMON_ASSETS.CHARACTER);
        fitImageToContainer(coloredDuck, container);
        container.remove(duck);
        duck.destroy();
        container.add(coloredDuck);

        const particles = this.add.particles(container.x, container.y, 'star', {
            speed: 30,
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            maxParticles: 10,
            lifespan: 1000
        });

        this.ducksFound++;
        if (this.ducksFound >= this.DUCKS_TO_FIND) {
            this.scene.start('MidCard');
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

    create() {
        adStart();
        this.suspenseTheme = this.sound.add('suspense_theme', {
            loop: true,
            volume: GAME_CONFIG.AUDIO.BG_MUSIC_VOLUME
        });
        this.suspenseTheme.play();
        this.editorCreate();
        this.events.on('shutdown', this.stopAudio, this);
    }
    
    stopAudio() {
        if (this.suspenseTheme) {
            this.suspenseTheme.stop();
        }
    }
}