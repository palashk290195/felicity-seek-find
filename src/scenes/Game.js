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

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
        this.layoutManager = null;
        this.gameStateManager = null;
        this.heartManager = null;
        this.benchManager = null;
        this.tutorialManager = null;
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

        // Setup state change handlers
        this.gameStateManager.onStateChange(GameState.PLAYING, () => {
            this.tutorialManager.stopTutorial();
            this.heartManager.startDecay();
        });

        this.gameStateManager.onStateChange(GameState.WIN, () => {
            this.handleWin();
        });

        this.gameStateManager.onStateChange(GameState.LOSE, () => {
            this.handleLose();
        });

        // Handle resize
        this.scale.on('resize', this.handleResize, this);

        // Play video
        // const videoContainerWidth = this.scale.width;
        // const videoContainerHeight = this.scale.height / 2;
        // const orientation = width > height ? 'landscape' : 'portrait';

        // this.layoutManager.updateAssetTransform("3658fc66-3c21-4a6f-bdb5-35c031bf77bf", orientation, {
        //                 width: this.video_container.width,
        //                 height: this.video_container.height,
        //                 x: this.video_container.x,
        //                 y: this.video_container.y
        //             });
        this.video.play(true);
        this.recalculateScale(this.video_container);
    }

    handleResize() {
        this.layoutManager.updateLayout();
    }

    handleWin() {
        // TODO: Implement win state handling
        console.log('Game Won!');
    }

    handleLose() {
        // TODO: Implement lose state handling
        console.log('Game Lost!');
    }

    destroy() {
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
        const gameAspectRatio = containerWidth / containerHeight;

        let scale;
        if (videoAspectRatio > gameAspectRatio) {
            scale = containerHeight / video_height;
        } else {
            scale = containerWidth / video_width;
        }

        this.video.setScale(scale*5);
    }
}