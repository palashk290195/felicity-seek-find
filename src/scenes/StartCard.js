import * as Phaser from '../phaser/phaser-3.87.0-core.js';
import { LayoutManager } from './utils/layout-manager.js';
import { START_CARD_LAYOUT } from '../config/start-card-layout.js';

export class StartCard extends Phaser.Scene {
    constructor() {
        super('StartCard');
        this.layoutManager = null;
    }

    create() {
        console.log('[StartCard][create] Initializing');
        this.cameras.main.setBackgroundColor('#ffffff');

        // Initialize layout manager with start card layout
        this.layoutManager = new LayoutManager(this, START_CARD_LAYOUT);

        // After 0.5 seconds, show the complete loader
        this.time.delayedCall(500, () => {
            // Hide incomplete loader and show complete loader
            this['incomplete-loader'].hide();
            this['complete-loader'].show();
        });

        // After 1 second, transition to the Game scene
        this.time.delayedCall(1000, () => {
            this.scene.start('Game');
        });
    }

    handleResize(gamSize) {
        // Update layout when resize occurs
        if (this.layoutManager) {
            this.layoutManager.updateLayout();
        }
    }
} 