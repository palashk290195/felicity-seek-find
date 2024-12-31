// EndCard.js
import * as Phaser from '../phaser/phaser-3.87.0-core.js';
import { handleCtaPressed, networkPlugin, adStart, adEnd, adClose, adRetry } from "../networkPlugin.js";
import { config } from "../config.js";
import { GAME_CONFIG, getCurrentLanguage, getSceneBackground } from "./utils/game-config.js";
import { createBackground } from './utils/layout-utils.js';

export class EndCard extends Phaser.Scene {
    constructor() {
        super("EndCard");
        this.state = {
            mapPositions: {}, // Track current position of each map
            mapAnimationPhases: {}, // Track animation phase for each map
            voiceoverPlayed: false,
            audioInitialized: false
        };
        
        // Scene elements
        this.maps = {};
        this.header = null;
        this.playButton = null;
        this.retryButton = null;
        this.voiceover = null;
    }


    logState(event = 'default') {
        console.log(`[EndCard][${event}]`, {
            state: this.state,
            dimensions: {
                width: this.scale.width,
                height: this.scale.height,
                isLandscape: this.scale.width > this.scale.height
            }
        });
    }

    create() {
        console.log('[EndCard][create] Initializing');
        this.createSceneElements();
        this.setupResizeHandler();
        
        // Only initialize audio if not already playing
        if (!this.state.audioInitialized) {
            this.initializeAudio();
        }
        
        adEnd();
        this.logState('create');
    }


    createSceneElements() {
        console.log('[EndCard][createSceneElements] Creating UI elements');
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;
        
        createBackground.call(this, gameWidth, gameHeight, getSceneBackground('END_CARD'));
        this.createHeader(gameWidth, gameHeight);
        this.createRetryButton(gameWidth, gameHeight);
        this.createPlayButton(gameWidth, gameHeight);
        this.createMaps(gameWidth, gameHeight);
    }

    createHeader(gameWidth, gameHeight) {
        const seekAndFind = this.add.image(
            gameWidth * 0.5,
            gameHeight * 0.05,
            GAME_CONFIG.COMMON_ASSETS.LOGO
        );
        const seekAndFindScale = Math.min(gameWidth, gameHeight) * GAME_CONFIG.SCENES.END_CARD.LOGO_SCALE_RATIO;
        seekAndFind.setScale(seekAndFindScale);
        this.header = seekAndFind;
    }

    createPlayButton(gameWidth, gameHeight) {
        const currentLanguage = getCurrentLanguage();
        const playbtn = this.add.image(
            gameWidth * 0.5,
            gameHeight * 0.9,
            currentLanguage.ASSETS.PLAY_BTN
        ).setInteractive();

        const playbtnScale = Math.min(gameWidth, gameHeight) * GAME_CONFIG.SCENES.END_CARD.BUTTON_SCALE_RATIO;
        playbtn.setScale(playbtnScale);
        
        playbtn.on('pointerdown', () => {
            handleCtaPressed();
        });

        // Add tween for continuous scaling
        this.tweens.add({
            targets: playbtn,
            scale: playbtnScale / 1.1,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.playButton = playbtn;
    }

    createMaps(gameWidth, gameHeight) {
        const mapPositions = [
            {x: 0.25, y: 0.55}, // pos1
            {x: 0.5, y: 0.4},   // pos2
            {x: 0.75, y: 0.55}  // pos3
        ];

        const mapScale = Math.min(gameWidth, gameHeight) * 0.0008;

        // Create maps
        const mapKeys = ['map1', 'map2', 'map3'];
        mapKeys.forEach((key, index) => {
            const map = this.add.image(
                gameWidth * mapPositions[index].x,
                gameHeight * mapPositions[index].y,
                key
            ).setScale(mapScale);

            this.maps[key] = map;
            this.state.mapPositions[key] = index;
            this.state.mapAnimationPhases[key] = 0;
        });

        // Create movements for each map
        this.setupMapMovements(gameWidth, gameHeight, mapPositions);
    }

    setupMapMovements(gameWidth, gameHeight, positions) {
        Object.entries(this.maps).forEach(([key, map], index) => {
            const sequence = this.getMapSequence(index);
            this.createMapMovement(map, key, sequence, gameWidth, gameHeight, positions);
        });
    }

    getMapSequence(startIndex) {
        return [(startIndex) % 3, (startIndex + 1) % 3, (startIndex + 2) % 3];
    }

    createMapMovement(map, mapKey, sequence, gameWidth, gameHeight, positions) {
        const currentPhase = this.state.mapAnimationPhases[mapKey];
        const currentIndex = sequence[currentPhase];
        
        this.tweens.add({
            targets: map,
            x: gameWidth * positions[currentIndex].x,
            y: gameHeight * positions[currentIndex].y,
            duration: 1000,
            ease: 'Linear',
            onComplete: () => {
                this.state.mapAnimationPhases[mapKey] = (currentPhase + 1) % sequence.length;
                this.createMapMovement(map, mapKey, sequence, gameWidth, gameHeight, positions);
            }
        });
    }

    createRetryButton(gameWidth, gameHeight) {
        const padding = 10;
        const buttonSize = 10;
        
        const retryButton = this.add.image(
            gameWidth - padding - buttonSize/2,
            padding + buttonSize/2,
            GAME_CONFIG.COMMON_ASSETS.RETRY_ICON
        );
        retryButton.setDisplaySize(buttonSize, buttonSize);
        
        retryButton
            .setInteractive()
            .on('pointerover', () => {
                retryButton.setTint(0x666666);
            })
            .on('pointerout', () => {
                retryButton.clearTint();
            })
            .on('pointerdown', () => {
                adRetry();
                this.scene.start('Game');
            });

        this.retryButton = retryButton;
    }

    initializeAudio() {
        console.log('[EndCard][initializeAudio] Setting up audio');
        const currentLanguage = getCurrentLanguage();
        this.voiceover = this.sound.add(currentLanguage.ASSETS.VOICEOVER);
        this.playVoiceover();
        this.state.audioInitialized = true;
    }

    playVoiceover() {
        if (!this.state.voiceoverPlayed && this.voiceover) {
            this.voiceover.play();
            this.state.voiceoverPlayed = true;
        }
    }

    setupResizeHandler() {
        this.scale.on('resize', this.handleResize, this);
    }

    handleResize(gameSize) {
        console.log('[EndCard][resize] New dimensions:', gameSize);
        
        if (!this.scene.isActive('EndCard')) {
            console.log('[EndCard][resize] Scene not active, skipping resize');
            return;
        }

        // Stop all animations except audio
        this.tweens.killAll();

        // Preserve audio states
        const currentAudio = this.voiceover;
        const wasPlaying = currentAudio?.isPlaying;
        const currentTime = currentAudio?.seek || 0;

        // Destroy and recreate all UI elements
        this.destroySceneElements();
        this.createSceneElements();

        // Restore audio if it was playing
        if (wasPlaying && currentAudio) {
            currentAudio.play();
            currentAudio.seek = currentTime;
        }
        
        this.logState('resize');
    }

    destroySceneElements() {
        console.log('[EndCard][destroySceneElements] Cleaning up');
        
        // Clean up maps
        Object.values(this.maps).forEach(map => map.destroy());
        this.maps = {};
        
        // Clean up other visual elements
        this.header?.destroy();
        this.playButton?.destroy();
        this.retryButton?.destroy();
        
        // Clear all existing game objects except audio
        this.children.getAll().forEach(child => {
            if (!(child instanceof Phaser.Sound.WebAudioSound || 
                  child instanceof Phaser.Sound.HTML5AudioSound)) {
                child.destroy();
            }
        });
    }
}