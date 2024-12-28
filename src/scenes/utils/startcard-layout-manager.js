import { GAME_CONFIG } from './game-config.js';

export class StartCardLayoutManager {
    constructor(scene) {
        this.scene = scene;
        this.containers = {};
        this.initializeContainers();
        
        // Setup resize handler
        this.scene.scale.on('resize', this.updateLayout, this);
        
        // Initial layout update
        this.updateLayout();
    }

    initializeContainers() {
        // Create containers for text and character
        const elements = ['text', 'character'];
        elements.forEach(element => {
            this.containers[element] = this.scene.add.container(0, 0);
        });

        if (GAME_CONFIG.debugMode) {
            this.addDebugVisuals();
        }
    }

    updateLayout = () => {
        const width = this.scene.scale.width;
        const height = this.scene.scale.height;
        const isLandscape = width > height;

        if (isLandscape) {
            this.applyLandscapeLayout(width, height);
        } else {
            this.applyPortraitLayout(width, height);
        }
    }

    applyPortraitLayout(width, height) {
        const { TEXT, CHARACTER } = GAME_CONFIG.START_CARD;
        
        // Text container
        const textContainer = this.containers.text;
        textContainer.setPosition(
            width * 0.5, // center horizontally
            height * TEXT.PORTRAIT.Y
        );
        textContainer.setSize(
            width * TEXT.PORTRAIT.WIDTH,
            height * TEXT.PORTRAIT.HEIGHT
        );

        // Character container
        const characterContainer = this.containers.character;
        characterContainer.setPosition(
            width * CHARACTER.PORTRAIT.X,
            height * CHARACTER.PORTRAIT.Y
        );
        characterContainer.setSize(
            width * CHARACTER.PORTRAIT.WIDTH,
            height * CHARACTER.PORTRAIT.HEIGHT
        );
    }

    applyLandscapeLayout(width, height) {
        const { TEXT, CHARACTER } = GAME_CONFIG.START_CARD;
        
        // Text container
        const textContainer = this.containers.text;
        textContainer.setPosition(
            width * 0.5, // center horizontally
            height * TEXT.LANDSCAPE.Y
        );
        textContainer.setSize(
            width * TEXT.LANDSCAPE.WIDTH,
            height * TEXT.LANDSCAPE.HEIGHT
        );

        // Character container
        const characterContainer = this.containers.character;
        characterContainer.setPosition(
            width * CHARACTER.LANDSCAPE.X,
            height * CHARACTER.LANDSCAPE.Y
        );
        characterContainer.setSize(
            width * CHARACTER.LANDSCAPE.WIDTH,
            height * CHARACTER.LANDSCAPE.HEIGHT
        );
    }

    addDebugVisuals() {
        const colors = {
            text: 0xff9999,     // Light red
            character: 0x99ff99  // Light green
        };

        Object.entries(this.containers).forEach(([key, container]) => {
            const rect = this.scene.add.rectangle(0, 0, 100, 100, colors[key], 0.5);
            container.add(rect);
            container.rect = rect;
        });
    }

    getContainers() {
        return this.containers;
    }

    getContainer(name) {
        return this.containers[name];
    }
}