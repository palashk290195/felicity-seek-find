// Game.js
import * as Phaser from '../phaser/phaser-3.87.0-core.js';
import { handleCtaPressed, networkPlugin, adStart, adEnd } from "../networkPlugin.js";
import { config } from "../config.js";
import { GAME_CONFIG, getCurrentLanguage, getSceneBackground, getCurrentPositions } from "./utils/game-config.js";
import { fitImageToContainer, fitTextToContainer } from "./utils/layout-utils.js";
import { AudioUtils } from '../utils/audio-utils.js';
import { LayoutManager } from './utils/layout-manager.js';
import { GAME_LAYOUT } from './utils/layout-config.js';

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
        this.layoutManager = null;
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

        // Handle resize
        this.scale.on('resize', this.handleResize, this);

        // Now you can access containers and assets directly:
        // this.video_container
        // this.character_container
        // this.main_video
        // etc...

        // Using direct scene references
        // this.main_video.hide();  // Hide the video
        // this.main_video.show();  // Show the video
        // this.main_video.toggleVisibility();  // Toggle visibility

        // // Or using layout manager
        // this.layoutManager.hideAsset('main_video');
        // this.layoutManager.showAsset('main_video');
        // this.layoutManager.toggleAssetVisibility('main_video');
    }

    handleResize() {
        this.layoutManager.updateLayout();
    }

    destroy() {
        this.layoutManager.destroy();
        super.destroy();
    }
}