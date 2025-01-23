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

            const sittingBody = this.scene.waldo_seating_body;

            this.idleParts = {
                hand,
                eyes,
                mouths,
                sittingBody
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
        if (this.scene.waldo_container) {
            this.startWaveMovement();
        }
    }

    startHandWave() {
        if (!this.idleParts?.hand) return;
        
        const config = this.config.IDLE.HAND;
        const hand = this.idleParts.hand;
        
        const createWaveSequence = async () => {
            // Ensure hand is at default position
            hand.setRotation(config.DEFAULT_ROTATION);

            const waveSequence = async () => {
                // Perform wave pairs (120° -> 150° sequences)
                for (let pair = 0; pair < config.WAVE.WAVE_PAIRS; pair++) {
                    // Wave to 120°
                    this.scene.tweens.add({
                        targets: hand,
                        rotation: config.WAVE.ROTATIONS.FIRST,
                        duration: config.WAVE.DURATION.WAVE,
                        ease: 'Cubic.easeOut'
                    });
                    await this.delay(config.WAVE.DURATION.WAVE);

                    // Wave to 150°
                    this.scene.tweens.add({
                        targets: hand,
                        rotation: config.WAVE.ROTATIONS.SECOND,
                        duration: config.WAVE.DURATION.WAVE,
                        ease: 'Cubic.easeInOut'
                    });
                    await this.delay(config.WAVE.DURATION.WAVE);

                    // If not the last pair, go back to 120° before next pair
                    if (pair < config.WAVE.WAVE_PAIRS - 1) {
                        this.scene.tweens.add({
                            targets: hand,
                            rotation: config.WAVE.ROTATIONS.FIRST,
                            duration: config.WAVE.DURATION.WAVE,
                            ease: 'Cubic.easeInOut'
                        });
                        await this.delay(config.WAVE.DURATION.WAVE);
                    }
                }

                // Return to default position
                this.scene.tweens.add({
                    targets: hand,
                    rotation: config.DEFAULT_ROTATION,
                    duration: config.WAVE.DURATION.RETURN,
                    ease: 'Cubic.easeIn'
                });

                // Schedule next wave sequence
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

    startWaveMovement() {
        const config = this.config.IDLE.WAVE_MOVEMENT;
        const container = this.scene.waldo_container;
        const gameWidth = this.scene.scale.width;
        const gameHeight = this.scene.scale.height;

        // Convert degrees to radians for rotation
        const maxAngleRad = Phaser.Math.DegToRad(config.ROTATION.MAX_ANGLE);

        const createWaveMovement = async () => {
            // Rotate clockwise
            this.scene.tweens.add({
                targets: container,
                rotation: maxAngleRad,
                duration: config.ROTATION.DURATION,
                ease: 'Sine.easeInOut',
                yoyo: true,
                onComplete: () => {
                    // Pause before counter-clockwise rotation
                    this.scene.time.delayedCall(config.ROTATION.PAUSE_DURATION, () => {
                        // Rotate counter-clockwise
                        this.scene.tweens.add({
                            targets: container,
                            rotation: -maxAngleRad,
                            duration: config.ROTATION.DURATION,
                            ease: 'Sine.easeInOut',
                            yoyo: true,
                            onComplete: () => {
                                // Pause before next cycle
                                this.scene.time.delayedCall(config.ROTATION.PAUSE_DURATION, createWaveMovement);
                            }
                        });
                    });
                }
            });
        };

        // Start the wave rotation
        createWaveMovement();

        // Store initial position
        const startX = container.x;
        const startY = container.y;

        // Calculate movement per second
        const rightMovement = gameWidth * config.MOVEMENT.RIGHT_SPEED;
        const upMovement = gameHeight * config.MOVEMENT.UP_SPEED;

        // Create continuous movement function
        const move = () => {
            container.x += rightMovement/100; //per 100 ms
            container.y -= upMovement/100; //per 100 ms

            // Schedule next movement
            this.scene.time.delayedCall(10, move);
        };

        // Start movement
        move();
    }

    transitionToLose() {
        if (!this.loseParts?.length) return;

        // Stop all tweens
        // this.scene.tweens.killAll();

        this.scene.time.removeAllEvents();

        // Hide idle state parts
        if (this.idleParts) {
            if (this.idleParts.hand) this.idleParts.hand.setVisible(false);
            if (this.idleParts.eyes) this.idleParts.eyes.forEach(eye => eye?.setVisible(false));
            if (this.idleParts.mouths) this.idleParts.mouths.forEach(mouth => mouth?.setVisible(false));
            if (this.idleParts.sittingBody) this.idleParts.sittingBody.setVisible(false);
        }

        if (this.scene.heart_bg) this.scene.heart_bg.setVisible(false);
        if (this.scene.heart_mask) this.scene.heart_mask.setVisible(false);


        // Show and animate standing Waldo
        this.loseParts.forEach(part => part?.setVisible(true));

        const config = this.config.LOSE.STANDING;
        const [body, leftHand, rightHand] = this.loseParts;

        // Only proceed with animations if we have the required parts
        if (leftHand && rightHand) {
            // Rotate hands
            this.scene.tweens.add({
                targets: leftHand,
                rotation: -Math.PI/2,
                duration: config.HAND_ROTATION_SPEED,
                repeat: -1
            });
            this.scene.tweens.add({
                targets: rightHand,
                rotation: Math.PI/2,
                duration: config.HAND_ROTATION_SPEED,
                repeat: -1
            });
        }
        
        AudioUtils.playSound(this.scene, 'player_fall_audio');
        AudioUtils.playSound(this.scene, 'player_fall_bg_audio');


        if (this.scene.waldo_container) {
            // Fall animation
            this.scene.tweens.add({
                targets: this.scene.waldo_container,
                y: `+=${this.scene.scale.height * 1}`,
                duration: config.FALL_DURATION,
                ease: 'Cubic.easeIn'
            });
        }
    }

    destroy() {
        this.scene.tweens.killAll();
    }
} 