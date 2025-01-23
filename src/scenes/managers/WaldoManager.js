import { GAME_CONFIG } from '../utils/game-config.js';
import { AudioUtils } from '../../utils/audio-utils.js';
import * as Phaser from '../../phaser/phaser-3.87.0-core.js';

export class WaldoManager {
    constructor(scene, layoutManager) {
        this.scene = scene;
        this.layoutManager = layoutManager;
        this.config = GAME_CONFIG.WALDO;
        
        this.initializeGameObjects();
        this.startIdleAnimations();
    }

    initializeGameObjects() {
        // Initialize idle state objects with error checking
        try {
            const hand = this.scene.waldo_seating_right_hand;
            if (!hand) {
                console.warn('Missing asset: waldo_sitting_right_hand');
            }

            const eyes = this.config.IDLE.FACE.BLINK.FRAMES.map(key => {
                const asset = this.layoutManager.getAsset(key);
                if (!asset) {
                    console.warn(`Missing asset: ${key}`);
                }
                return asset;
            }).filter(Boolean); // Remove any undefined assets

            const mouths = this.config.IDLE.FACE.SPEAK.FRAMES.map(key => {
                const asset = this.layoutManager.getAsset(key);
                if (!asset) {
                    console.warn(`Missing asset: ${key}`);
                }
                return asset;
            }).filter(Boolean);

            this.idleParts = {
                hand,
                eyes,
                mouths
            };

            // Initialize lose state objects (hidden initially)
            this.loseParts = this.config.LOSE.STANDING.PARTS.map(key => {
                const part = this.layoutManager.getAsset(key);
                if (!part) {
                    console.warn(`Missing asset: ${key}`);
                    return null;
                }
                part.setVisible(false);
                return part;
            }).filter(Boolean);

            // Only proceed with initialization if we have the required assets
            if (this.idleParts.hand && this.idleParts.eyes.length > 0 && this.idleParts.mouths.length > 0) {
                // Show only first frame of facial features
                this.showOnlyFrame(this.idleParts.eyes, 0);
                this.showOnlyFrame(this.idleParts.mouths, 0);
            } else {
                console.error('Missing required Waldo assets, animations will not work');
            }

        } catch (error) {
            console.error('Error initializing Waldo assets:', error);
        }
    }

    showOnlyFrame(objects, frameIndex) {
        if (!objects || objects.length === 0) return;
        objects.forEach((obj, index) => {
            if (obj && obj.setVisible) {
                obj.setVisible(index === frameIndex);
            }
        });
    }

    startIdleAnimations() {
        // Only start animations if we have the required assets
        if (this.idleParts?.hand) {
            this.startHandWave();
        }
        if (this.idleParts?.eyes?.length > 0) {
            this.startBlinking();
        }
        if (this.idleParts?.mouths?.length > 0) {
            this.startSpeaking();
        }
    }

    startHandWave() {
        if (!this.idleParts?.hand) return;
        
        const config = this.config.IDLE.HAND;
        const hand = this.idleParts.hand;
        
        const createWaveSequence = async () => {
            // Set initial position if not already set
            hand.setRotation(config.DEFAULT_ROTATION);

            // Create the wave sequence
            const waveSequence = async () => {
                // 1. Raise hand to original position
                this.scene.tweens.add({
                    targets: hand,
                    rotation: 0,
                    duration: config.WAVE.DURATION.RAISE,
                    ease: 'Cubic.easeOut'
                });
                await this.delay(config.WAVE.DURATION.RAISE);

                // 2. Perform wave movements
                for (let i = 0; i < config.WAVE.WAVE_COUNT; i++) {
                    // Wave up
                    this.scene.tweens.add({
                        targets: hand,
                        rotation: config.WAVE.UP_ROTATION,
                        duration: config.WAVE.DURATION.WAVE,
                        ease: 'Cubic.easeInOut'
                    });
                    await this.delay(config.WAVE.DURATION.WAVE);

                    // Wave down
                    this.scene.tweens.add({
                        targets: hand,
                        rotation: 0,
                        duration: config.WAVE.DURATION.WAVE,
                        ease: 'Cubic.easeInOut'
                    });
                    await this.delay(config.WAVE.DURATION.WAVE);
                }

                // 3. Lower hand back to default position
                this.scene.tweens.add({
                    targets: hand,
                    rotation: config.DEFAULT_ROTATION,
                    duration: config.WAVE.DURATION.LOWER,
                    ease: 'Cubic.easeIn'
                });

                // 4. Schedule next wave sequence
                const nextInterval = Phaser.Math.Between(
                    config.WAVE.INTERVAL.MIN,
                    config.WAVE.INTERVAL.MAX
                );
                this.scene.time.delayedCall(nextInterval, waveSequence);
            };

            waveSequence();
        };

        // Start the initial wave sequence
        createWaveSequence();
    }

    delay(ms) {
        return new Promise(resolve => this.scene.time.delayedCall(ms, resolve));
    }

    async startBlinking() {
        if (!this.idleParts?.eyes?.length) return;
        
        const config = this.config.IDLE.FACE.BLINK;
        
        const blink = async () => {
            if (!this.idleParts?.eyes?.length) return;

            for (let i = 0; i < this.idleParts.eyes.length; i++) {
                this.showOnlyFrame(this.idleParts.eyes, i);
                await this.delay(config.FRAME_DURATION);
            }

            // Return to first frame
            this.showOnlyFrame(this.idleParts.eyes, 0);

            // Schedule next blink
            const interval = Phaser.Math.Between(
                config.INTERVAL.MIN,
                config.INTERVAL.MAX
            );
            this.scene.time.delayedCall(interval, blink);
        };

        blink();
    }

    async startSpeaking() {
        if (!this.idleParts?.mouths?.length) return;
        
        const config = this.config.IDLE.FACE.SPEAK;
        
        const speak = async () => {
            if (!this.idleParts?.mouths?.length) return;

            AudioUtils.playSound(this.scene, config.SOUND);

            for (let i = 0; i < this.idleParts.mouths.length; i++) {
                this.showOnlyFrame(this.idleParts.mouths, i);
                await this.delay(config.FRAME_DURATION);
            }

            // Return to first frame
            this.showOnlyFrame(this.idleParts.mouths, 0);

            // Schedule next speak
            const interval = Phaser.Math.Between(
                config.INTERVAL.MIN,
                config.INTERVAL.MAX
            );
            this.scene.time.delayedCall(interval, speak);
        };

        speak();
    }

    transitionToLose() {
        if (!this.loseParts?.length) return;

        // Stop all tweens
        this.scene.tweens.killAll();

        // Hide idle state parts
        if (this.idleParts) {
            if (this.idleParts.hand) this.idleParts.hand.setVisible(false);
            if (this.idleParts.eyes) this.idleParts.eyes.forEach(eye => eye?.setVisible(false));
            if (this.idleParts.mouths) this.idleParts.mouths.forEach(mouth => mouth?.setVisible(false));
        }

        // Show and animate standing Waldo
        this.loseParts.forEach(part => part?.setVisible(true));

        const config = this.config.LOSE.STANDING;
        const [body, leftHand, rightHand] = this.loseParts;

        // Only proceed with animations if we have the required parts
        if (leftHand && rightHand) {
            // Rotate hands
            this.scene.tweens.add({
                targets: [leftHand, rightHand],
                rotation: Math.PI * 2,
                duration: config.HAND_ROTATION_SPEED,
                repeat: -1
            });
        }

        if (this.loseParts.length > 0) {
            // Fall animation
            this.scene.tweens.add({
                targets: this.loseParts,
                y: `+=${this.scene.scale.height * 0.3}`,
                duration: config.FALL_DURATION,
                ease: 'Cubic.easeIn'
            });
        }
    }

    destroy() {
        this.scene.tweens.killAll();
    }
} 