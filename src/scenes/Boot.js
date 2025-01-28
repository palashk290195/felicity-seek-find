import * as Phaser from '../phaser/phaser-3.87.0-core.js';

export class Boot extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        const loadingText = this.add.text(
            this.scale.width / 2,
            this.scale.height / 2,
            'Loading...',
            { font: '20px Arial', fill: '#ffffff' }
        );
        loadingText.setOrigin(0.5, 0.5);
    }

    create() {
        

        this.scene.start('Preload');
    }

}