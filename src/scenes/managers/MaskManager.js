import { fitTextToContainer } from '../utils/layout-utils.js';
import { getCurrentLanguage } from '../utils/game-config.js';

export class MaskManager {
    constructor(scene, layoutManager) {
        this.scene = scene;
        this.layoutManager = layoutManager;
        this.isVisible = true;
        const currentLanguage = getCurrentLanguage();
        this.textContent = currentLanguage.TEXT.TITLE;
        
        this.initializeMask();
    }

    initializeMask() {
        // Get the mask container from layout
        const maskContainer = this.layoutManager.getContainer('mask_container');
        
        // Create a semi-transparent black rectangle for the overlay
        const graphics = this.scene.add.graphics();
        
        // Create text
        const text = this.scene.add.text(0, 0, this.textContent, {
            fontFamily: 'Comic Sans MS',
            color: '#ffffff',
            align: 'center',
            fontStyle: 'bold'
        });
        
        // Add both to mask container
        maskContainer.add([graphics, text]);
        
        // Store references
        this.graphics = graphics;
        this.text = text;
        this.maskContainer = maskContainer;
        
        // Set high depth to ensure overlay is on top
        maskContainer.setDepth(1000);
        
        // Add click handler to the entire scene
        this.scene.input.on('pointerdown', this.handleClick, this);

        // Update graphics and text
        this.updateMaskContent();
    }

    updateMaskContent() {
        // Update graphics
        this.graphics.clear();
        this.graphics.fillStyle(0x000000, 0.6);
        this.graphics.fillRect(-this.maskContainer.width/2, -this.maskContainer.height/2, this.maskContainer.width, this.maskContainer.height);
        
        // Update text container and position
        const textContainer = {
            width: this.maskContainer.width * 0.5,
            height: this.maskContainer.height * 0.3
        };
        
        fitTextToContainer(this.text, textContainer, this.textContent);
    }

    handleClick() {
        if (this.isVisible) {
            this.hide();
        }
    }

    hide() {
        this.isVisible = false;
        if (this.maskContainer) {
            this.maskContainer.setVisible(false);
        }
    }

    handleResize() {
        if (!this.isVisible) return;
        this.updateMaskContent();
    }

    destroy() {
        if (this.scene) {
            this.scene.input.off('pointerdown', this.handleClick, this);
        }
        if (this.graphics) {
            this.graphics.destroy();
        }
        if (this.text) {
            this.text.destroy();
        }
    }
} 