// startcard-layout-manager.js
import { GAME_CONFIG } from './game-config.js';

export class StartCardLayoutManager {
    constructor(scene) {
        this.scene = scene;
        this.containers = {};
        this.initializeContainers();
        
        // Initial layout update
        this.updateLayout();
        
        console.log('[StartCardLayoutManager] Initialized', {
            sceneWidth: this.scene.scale.width,
            sceneHeight: this.scene.scale.height,
            isLandscape: this.scene.scale.width > this.scene.scale.height
        });
    }

    initializeContainers() {
        console.log('[StartCardLayoutManager] Creating containers');
        
        // Create containers for text and character
        const elements = ['text', 'character', 'logo'];
        elements.forEach(element => {
            this.containers[element] = this.scene.add.container(0, 0);
            console.log(`[StartCardLayoutManager] Created ${element} container`);
        });

        if (GAME_CONFIG.debugMode) {
            this.addDebugVisuals();
        }
    }

    updateLayout = () => {
        const width = this.scene.scale.width;
        const height = this.scene.scale.height;
        const isLandscape = width > height;

        console.log('[StartCardLayoutManager] Updating layout', {
            width,
            height,
            isLandscape,
            orientation: isLandscape ? 'landscape' : 'portrait'
        });

        if (isLandscape) {
            this.applyLandscapeLayout(width, height);
        } else {
            this.applyPortraitLayout(width, height);
        }

        // Log final container positions
        Object.entries(this.containers).forEach(([key, container]) => {
            console.log(`[StartCardLayoutManager] Container ${key} position:`, {
                x: container.x,
                y: container.y,
                width: container.width,
                height: container.height
            });
        });
    }

    applyPortraitLayout(width, height) {
        const { TEXT, CHARACTER } = GAME_CONFIG.SCENES.START_CARD;
        
        // Logo container
        const logoContainer = this.containers.logo;
        if (logoContainer) {
            logoContainer.setPosition(
                width * 0.5,
                height * 0.1
            );
            logoContainer.setSize(
                width * 0.5,
                height * 0.15
            );
        }

        // Text container
        const textContainer = this.containers.text;
        if (textContainer) {
            textContainer.setPosition(
                width * 0.5,
                height * TEXT.PORTRAIT.Y
            );
            textContainer.setSize(
                width * TEXT.PORTRAIT.WIDTH,
                height * TEXT.PORTRAIT.HEIGHT
            );
        }

        // Character container
        const characterContainer = this.containers.character;
        if (characterContainer) {
            characterContainer.setPosition(
                width * CHARACTER.PORTRAIT.X,
                height * CHARACTER.PORTRAIT.Y
            );
            characterContainer.setSize(
                width * CHARACTER.PORTRAIT.WIDTH,
                height * CHARACTER.PORTRAIT.HEIGHT
            );
        }

        console.log('[StartCardLayoutManager] Applied portrait layout');
    }

    applyLandscapeLayout(width, height) {
        const { TEXT, CHARACTER } = GAME_CONFIG.SCENES.START_CARD;
        
        // Logo container
        const logoContainer = this.containers.logo;
        if (logoContainer) {
            logoContainer.setPosition(
                width * 0.5,
                height * 0.1
            );
            logoContainer.setSize(
                width * 0.5,
                height * 0.2
            );
        }

        // Text container
        const textContainer = this.containers.text;
        if (textContainer) {
            textContainer.setPosition(
                width * 0.5,
                height * (TEXT.LANDSCAPE.Y + 0.15)
            );
            textContainer.setSize(
                width * TEXT.LANDSCAPE.WIDTH,
                height * TEXT.LANDSCAPE.HEIGHT
            );
        }

        // Character container
        const characterContainer = this.containers.character;
        if (characterContainer) {
            characterContainer.setPosition(
                width * CHARACTER.LANDSCAPE.X,
                height * (CHARACTER.LANDSCAPE.Y + 0.15)
            );
            characterContainer.setSize(
                width * CHARACTER.LANDSCAPE.WIDTH,
                height * CHARACTER.LANDSCAPE.HEIGHT
            );
        }

        console.log('[StartCardLayoutManager] Applied landscape layout');
    }

    addDebugVisuals() {
        console.log('[StartCardLayoutManager] Adding debug visuals');
        
        const colors = {
            text: 0xff9999,     // Light red
            character: 0x99ff99,  // Light green
            logo: 0x9999ff      // Light blue
        };

        Object.entries(this.containers).forEach(([key, container]) => {
            const rect = this.scene.add.rectangle(0, 0, 100, 100, colors[key], 0.5);
            container.add(rect);
            container.rect = rect;
            
            console.log(`[StartCardLayoutManager] Added debug visual for ${key}`);
        });
    }

    getContainers() {
        return this.containers;
    }

    getContainer(name) {
        return this.containers[name];
    }

    // Method to handle cleanup if needed
    destroy() {
        Object.values(this.containers).forEach(container => {
            container.destroy();
        });
        this.containers = {};
        
        console.log('[StartCardLayoutManager] Destroyed all containers');
    }
}