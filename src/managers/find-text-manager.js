import { GAME_CONFIG, getCurrentLanguage } from '../scenes/utils/game-config.js';
import { fitTextToContainer } from '../scenes/utils/layout-utils.js';

export class FindTextManager {
    constructor(scene, textBg, mainContainer) {
        this.scene = scene;
        this.textBg = textBg;
        this.mainContainer = mainContainer;
        this.remainingCount = 6;
        this.setupText();
    }

    setupText() {
        // Create a container with the same position as text-bg but scaled down
        const containerWidth = this.textBg.displayWidth * GAME_CONFIG.display.findText.containerScale;
        const containerHeight = this.textBg.displayHeight * GAME_CONFIG.display.findText.containerScale;
        
        // Create a container object for the text to fit within
        this.container = {
            width: containerWidth,
            height: containerHeight
        };

        // Create the text game object with center origin
        if (!this.findText) {
            this.findText = this.scene.add.text(
                0,
                0,
                '',
                {
                    ...GAME_CONFIG.display.findText.style,
                    align: 'center'
                }
            );
            this.findText.setOrigin(0.5, 0.5);
            this.mainContainer.add(this.findText);
        }

        this.updateText();
    }

    updatePosition() {
        if (this.findText && this.textBg) {
            // Position relative to text-bg's center, accounting for container's position
            this.findText.setPosition(
                this.textBg.x,
                this.textBg.y
            );
        }
    }

    updateText() {
        const language = getCurrentLanguage();
        const text = language.find_text.replace('{count}', this.remainingCount);
        
        // Use the fitTextToContainer utility to size the text properly
        fitTextToContainer(this.findText, this.container, text);
        this.updatePosition();
    }

    decrementCount(clickedCount) {
        console.log('decrementCount', this.remainingCount);
        this.remainingCount = 6 - clickedCount;
        this.updateText();
    }

    getRemainingCount() {
        return this.remainingCount;
    }
} 