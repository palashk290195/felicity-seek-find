// Game.js
import * as Phaser from '../phaser/phaser-3.87.0-core.js';
import { handleCtaPressed, networkPlugin, adStart, adEnd } from "../networkPlugin.js";
import { config } from "../config.js";
import { GAME_CONFIG, getCurrentLanguage, getSceneBackground, getCurrentPositions } from "./utils/game-config.js";
import { fitImageToContainer, fitTextToContainer } from "./utils/layout-utils.js";
import { AudioUtils } from '../utils/audio-utils.js';
import { LayoutManager } from './utils/layout-manager.js';
import { GAME_LAYOUT } from './utils/layout-config.js';
import { GameStateManager, GameState } from './managers/GameStateManager.js';
import { HeartManager } from './managers/HeartManager.js';
import { BenchInteractionManager } from './managers/BenchInteractionManager.js';
import { TutorialManager } from './managers/TutorialManager.js';
import { ImageFitter } from './utils/image-fitter.js';
import { WaldoManager } from './managers/WaldoManager.js';

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
        this.layoutManager = null;
        this.gameStateManager = null;
        this.heartManager = null;
        this.benchManager = null;
        this.tutorialManager = null;
        this.waldoManager = null;
    }

    create() {
        console.log('[Game][create] Initializing');
        this.cameras.main.setBackgroundColor('#ffffff');

        // Setup audio handling
        const cleanup = AudioUtils.setup(this);

        // Clean up when scene shuts down
        this.events.once('shutdown', cleanup);

        // Initialize layout manager
        this.layoutManager = new LayoutManager(this, GAME_LAYOUT);

        // Initialize game state manager
        this.gameStateManager = new GameStateManager(this);

        // Get required game objects from layout manager
        const heartMask = this.layoutManager.getAsset('heart_mask');
        const heartBg = this.layoutManager.getAsset('heart_bg');
        const hand = this.layoutManager.getAsset('hand');
        const benches = [
            this.layoutManager.getAsset('object_bench1'),
            this.layoutManager.getAsset('object_bench2'),
            this.layoutManager.getAsset('object_bench3'),
            this.layoutManager.getAsset('object_bench4'),
            this.layoutManager.getAsset('object_bench5'),
            this.layoutManager.getAsset('object_bench6'),
            this.layoutManager.getAsset('object_bench7')
        ];

        // Initialize managers
        this.heartManager = new HeartManager(this, heartMask);
        this.benchManager = new BenchInteractionManager(this, benches, heartBg);
        this.tutorialManager = new TutorialManager(this, hand);

        // Initialize Waldo manager (animations start immediately)
        this.waldoManager = new WaldoManager(this, this.layoutManager);

        // Setup state change handlers
        this.gameStateManager.onStateChange(GameState.PLAYING, () => {
            this.tutorialManager.stopTutorial();
            this.heartManager.startDecay();
        });

        this.gameStateManager.onStateChange(GameState.WIN, () => {
            this.handleWin();
        });

        this.gameStateManager.onStateChange(GameState.LOSE, () => {
            this.waldoManager.transitionToLose();
            this.handleLose();
        });

        // Handle resize
        this.scale.on('resize', this.handleResize, this);

        // Get video from layout manager and play it
        const video = this.layoutManager.getAsset('video');
        video.setScale(video.scaleX / 2.8, video.scaleY / 1.8);
        video.play(true);

        AudioUtils.playSound(this, 'acid_flowing_audio', {
            loop: true,
            volume: 1
        });

        AudioUtils.playSound(this, 'acid_hole_audio', {
            loop: true,
            volume: 1
        });
    }

    handleResize() {
        // First update the layout
        this.layoutManager.updateLayout();
    }

    handleWin() {
        this.scene.start('MidCard');
        console.log('Game Won!');
    }

    handleLose() {
        setTimeout(() => {
            this.scene.start('EndCard');
        }, 2000);
        console.log('Game Lost!');
    }

    destroy() {
        if (this.waldoManager) {
            this.waldoManager.destroy();
        }
        this.layoutManager.destroy();
        super.destroy();
    }

    recalculateScale(container) {
        if (!this.video) return;
        const video_width = 2048;
        const video_height = 2048;
        const containerWidth = container.width;
        const containerHeight = container.height;

        const videoAspectRatio = video_width / video_height;
        const containerAspectRatio = containerWidth / containerHeight;

        let scale;
        if (videoAspectRatio > containerAspectRatio) {
            scale = containerHeight / video_height;
        } else {
            scale = containerWidth / video_width;
        }

        console.log("video3 ", containerWidth, containerHeight, containerAspectRatio, videoAspectRatio);
        this.video.setScale(scale*5);
    }
}