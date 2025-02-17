import { LayoutManager } from './utils/layout-manager.js';
import { END_CARD_LAYOUT } from '../config/end-card-layout.js';
import { adRetry, adEnd, handleCtaPressed } from '../networkPlugin.js';
import * as Phaser from '../phaser/phaser-3.87.0-core.js';
import { getCurrentLanguage } from './utils/game-config.js';
import { fitTextToContainer } from './utils/layout-utils.js';
import { AudioUtils } from '../utils/audio-utils.js';

export class EndCard extends Phaser.Scene {
    constructor() {
        super('EndCard');
        this.layoutManager = null;
        this.ctaTween = null;
        this.ctaText = null;
    }

    init() {
        this.cameras.main.setBackgroundColor('#964B00');
    }

    create() {
        // Initialize layout manager with end card layout
        this.layoutManager = new LayoutManager(this, END_CARD_LAYOUT);
        const cleanup = AudioUtils.setup(this);
        this.events.once('shutdown', cleanup);

        // Get current language and play voiceover
        const languageConfig = getCurrentLanguage();
        if (languageConfig.voiceover_key) {
            AudioUtils.playSound(this, languageConfig.voiceover_key);
        }

        // Get the background and set initial alpha
        const bg = this.layoutManager.getAsset('end-bg');
        if (bg) {
            bg.setAlpha(0);
            // Create fade in tween
            this.tweens.add({
                targets: bg,
                alpha: 1,
                duration: 1000,
                ease: 'Linear'
            });
        }

        // Setup CTA button
        const cta = this.layoutManager.getAsset('cta');
        if (cta) {
            cta.setInteractive();
            cta.on('pointerdown', () => {
                adRetry();
                handleCtaPressed();
            });

            // Create continuous scale tween
            this.ctaTween = this.tweens.add({
                targets: cta,
                scaleX: cta.scaleX * 1.2,
                scaleY: cta.scaleY * 1.2,
                duration: 800,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            // Add CTA text
            this.addCtaText(cta);

            // Create separate tween for CTA text
            if (this.ctaText) {
                this.tweens.add({
                    targets: this.ctaText,
                    scaleX: this.ctaText.scaleX * 1.2,
                    scaleY: this.ctaText.scaleY * 1.2,
                    duration: 800,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }
        }
        adEnd();
    }

    addCtaText(ctaButton) {
        // Create text object if it doesn't exist
        if (!this.ctaText) {
            this.ctaText = this.add.text(0, 0, '', {
                fontFamily: 'Arial',
                fontSize: '32px',
                color: '#000000'
            });

            // Add text to main container if it exists
            const mainContainer = this['main-container'];
            if (mainContainer) {
                mainContainer.add(this.ctaText);
            }
        }

        // Get current language text
        const languageConfig = getCurrentLanguage();
        const ctaText = languageConfig.end_card_cta;

        // Create a container for sizing
        const textContainer = {
            width: ctaButton.displayWidth * 0.5,
            height: ctaButton.displayHeight * 0.5
        };

        // Fit text to container
        fitTextToContainer(this.ctaText, textContainer, ctaText);
        this.ctaText.setPosition(ctaButton.x, ctaButton.y);

        // Add text to tween targets to scale with the button
        if (this.ctaTween) {
            this.ctaTween.targets.push(this.ctaText);
        }
    }

    handleResize(gameSize) {
        // Update layout
        if (this.layoutManager) {
            this.layoutManager.updateLayout();
        }

        // Get CTA button
        const cta = this.layoutManager.getAsset('cta');
        
        // If CTA tween was running, restart it to maintain animation after resize
        if (cta && this.ctaTween) {
            // Store the current scale to maintain animation state
            const currentScale = cta.scaleX;
            
            // Stop current tween
            this.ctaTween.stop();

            // Update CTA text position and size
            if (cta && this.ctaText) {
                const textContainer = {
                    width: cta.displayWidth * 0.5,
                    height: cta.displayHeight * 0.5
                };
                
                fitTextToContainer(this.ctaText, textContainer, this.ctaText.text);
                this.ctaText.setPosition(cta.x, cta.y);

                // Create separate tween for text with its current scale
                const currentTextScale = this.ctaText.scaleX;
                this.tweens.add({
                    targets: this.ctaText,
                    scaleX: currentTextScale * 1.2,
                    scaleY: currentTextScale * 1.2,
                    duration: 800,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }
            
            // Create new tween with current scale as base for CTA button only
            this.ctaTween = this.tweens.add({
                targets: cta,
                scaleX: currentScale * 1.2,
                scaleY: currentScale * 1.2,
                duration: 800,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }
} 