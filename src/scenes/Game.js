// Game.js
import * as Phaser from '../phaser/phaser-3.87.0-core.js';
import { handleCtaPressed, networkPlugin, adStart, adEnd } from "../networkPlugin.js";
import { config } from "../config.js";
import { GAME_CONFIG, getCurrentLanguage, getSceneBackground, getCurrentPositions } from "./utils/game-config.js";
import { fitImageToContainer, fitTextToContainer } from "./utils/layout-utils.js";
import { AudioUtils } from '../utils/audio-utils.js';
import { LayoutManager } from './utils/layout-manager.js';
import { GAME_LAYOUT } from './utils/layout-config.js';
import { GameStateManager, GameState } from './managers/GameStateManager.js';
import { HeartManager } from './managers/HeartManager.js';
import { BenchInteractionManager } from './managers/BenchInteractionManager.js';
import { TutorialManager } from './managers/TutorialManager.js';
import { ImageFitter } from './utils/image-fitter.js';
import { WaldoManager } from './managers/WaldoManager.js';
import { MaskManager } from './managers/MaskManager.js';


export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
        this.layoutManager = null;
        this.gameStateManager = null;
        this.heartManager = null;
        this.benchManager = null;
        this.tutorialManager = null;
        this.waldoManager = null;
        this.maskManager = null;
    }

    create() {
        console.log('[Game][create] Initializing');
        this.cameras.main.setBackgroundColor('#ffffff');

        const cleanup = AudioUtils.setup(this);
        this.events.once('shutdown', cleanup);
        this.layoutManager = new LayoutManager(this, GAME_LAYOUT);

        // Initialize game state manager
        this.gameStateManager = new GameStateManager(this);

        // Get required game objects from layout manager
        const heartMask = this.layoutManager.getAsset('heart_mask');
        const heartBg = this.layoutManager.getAsset('heart_bg');
        const hand = this.layoutManager.getAsset('hand');
        const benches = [
            this.layoutManager.getAsset('object_bench1'),
            this.layoutManager.getAsset('object_bench2'),
            this.layoutManager.getAsset('object_bench3'),
            this.layoutManager.getAsset('object_bench4'),
            this.layoutManager.getAsset('object_bench5'),
            this.layoutManager.getAsset('object_bench6'),
            this.layoutManager.getAsset('object_bench7')
        ];

        // Initialize managers
        this.heartManager = new HeartManager(this, heartMask);
        this.benchManager = new BenchInteractionManager(this, benches, heartBg);
        this.tutorialManager = new TutorialManager(this, hand);
        this.waldoManager = new WaldoManager(this, this.layoutManager);
        this.maskManager = new MaskManager(this, this.layoutManager);

        // Setup state change handlers
        this.gameStateManager.onStateChange(GameState.PLAYING, () => {
            this.tutorialManager.stopTutorial();
            this.heartManager.startDecay();
        });

        this.gameStateManager.onStateChange(GameState.WIN, () => {
            this.handleWin();
        });

        this.gameStateManager.onStateChange(GameState.LOSE, () => {
            this.waldoManager.transitionToLose();
            this.handleLose();
        });

        // Handle resize
        this.scale.on('resize', this.handleResize, this);

        // Get video from layout manager and play it
        const video = this.layoutManager.getAsset('video');
        video.setScale(video.scaleX / 1.87, video.scaleY / 1.87);
        video.play(true);

        //setup stream
        this.setupStream()
        // river
        this.setupRiver()
        this.setupWave()
        this.setupTank()
        

        AudioUtils.playSound(this, 'acid_flowing_audio', {
            loop: true,
            volume: 1
        });

        AudioUtils.playSound(this, 'acid_hole_audio', {
            loop: true,
            volume: 1
        });
    }

    handleResize() {
        // First update the layout
        this.tweens.killAll();
        // Clear all masks 
        this.game.scene.scenes.forEach(scene => {
            scene.children.list
            .filter(child => child instanceof Phaser.Display.Masks.BitmapMask)
            .forEach(mask => mask.destroy());
        });
        this.layoutManager.updateLayout();
        this.setupRiver();
        this.setupStream();
        this.setupWave();
        this.setupTank();
        
        // Update mask overlay
        if (this.maskManager) {
            this.maskManager.handleResize();
        }
    }

    handleWin() {
        this.scene.start('MidCard');
        console.log('Game Won!');
    }

    handleLose() {
        setTimeout(() => {
            this.scene.start('EndCard');
        }, 2000);
        console.log('Game Lost!');
    }

    destroy() {
        if (this.waldoManager) {
            this.waldoManager.destroy();
        }
        if (this.maskManager) {
            this.maskManager.destroy();
        }
        this.layoutManager.destroy();
        super.destroy();
    }

    recalculateScale(container) {
        if (!this.video) return;
        const video_width = 2048;
        const video_height = 2048;
        const containerWidth = container.width;
        const containerHeight = container.height;

        const videoAspectRatio = video_width / video_height;
        const containerAspectRatio = containerWidth / containerHeight;

        let scale;
        if (videoAspectRatio > containerAspectRatio) {
            scale = containerHeight / video_height;
        } else {
            scale = containerWidth / video_width;
        }

        console.log("video3 ", containerWidth, containerHeight, containerAspectRatio, videoAspectRatio);
        this.video.setScale(scale*5);
    }

    setupStream() {
        const screenWidth = this.scale.width;
        const screenHeight = this.scale.height;

        const baseAcid = this.layoutManager.getAsset('acid_stream');
        const position = this.layoutManager.getAbsolutePosition(baseAcid);
        const streams = {
            whiteMask1: this.layoutManager.getAsset("stream_mask_white"),
            whiteMask2: this.layoutManager.getAsset("stream_mask_white2"), 
            blackMask1: this.layoutManager.getAsset("stream_mask_black"),
            blackMask2: this.layoutManager.getAsset("stream_mask_black2")
        };
    
        // Create mask
        const maskGraphics = this.make.graphics();
        const width = baseAcid.displayWidth;
        const height = baseAcid.displayHeight;
        
        maskGraphics.beginPath();
        maskGraphics.fillStyle(0xffffff, 1);
        maskGraphics.fillRect(position.x, position.y + width/2, width, height);
        maskGraphics.arc(position.x + width/2, position.y + width/2, width/2, Math.PI, 0, false);
        maskGraphics.setRotation(position.rotation);
        maskGraphics.fillPath();
        
        const mask = new Phaser.Display.Masks.BitmapMask(this, maskGraphics);
    
        // Position streams
        Object.values(streams).forEach(stream => {
            stream.setRotation(position.rotation);
            // stream.setScale(0.45)
            stream.setScale(position.scale.x, position.scale.y);
            stream.setMask(mask);
        });
        
        const FLOW_SPEED_BLACK = GAME_CONFIG.SCENES.GAME.SPEED_STREAM_BLACK*screenHeight;
        const FLOW_SPEED_WHITE = GAME_CONFIG.SCENES.GAME.SPEED_STREAM_WHITE*screenHeight;
        
        // Adjust initial positions for continuous flow
        const startY1 = streams.blackMask1.y;
        // streams.blackMask1.y = streams.blackMask1.y;
        // streams.whiteMask1.y = streams.whiteMask1.y;
        
        // Ensure masks overlap at transition points
        // streams.blackMask2.y = streams.blackMask1.y - streams.blackMask1.displayHeight*.997;
        // streams.whiteMask2.y = streams.whiteMask1.y - streams.whiteMask1.displayHeight*.997;
        
        streams.blackMask2.y = streams.blackMask1.y - streams.blackMask1.displayHeight*.997;
        streams.whiteMask2.y = streams.whiteMask1.y - streams.whiteMask1.displayHeight*.997;
        const endY = streams.blackMask1.y + streams.blackMask1.displayHeight*.997;
    
        // Set depths
        [baseAcid, ...Object.values(streams)].forEach((obj, i) => {
            obj.setDepth(i);
        });
    
        // Create continuous tween
        const createTween = (mask, initialY, endY, FLOW_SPEED) => {
            return this.tweens.add({
                targets: mask,
                y: { from: initialY, to: endY },
                duration: (endY - initialY) / FLOW_SPEED * 1000,
                ease: 'Linear',
                onComplete: () => {
                    // Reset without gap
                    mask.y = startY1 - mask.displayHeight*.997;
                    createTween(mask, mask.y, endY, FLOW_SPEED);
                }
            });
        };
    
        // Start animations
        [streams.blackMask1, streams.blackMask2].forEach(stream => {
            stream.setBlendMode(Phaser.BlendModes.SCREEN);
            createTween(stream, stream.y, endY, FLOW_SPEED_BLACK);
        });
        
        [streams.whiteMask1, streams.whiteMask2].forEach(stream => {
            stream.setBlendMode(Phaser.BlendModes.COLOR_DODGE);
            createTween(stream, stream.y, endY, FLOW_SPEED_WHITE);
        });
    }

    setupRiver() {
        const screenWidth = this.scale.width;
        const screenHeight = this.scale.height;

        const acidRiver1 = this.layoutManager.getAsset("acid_river")
        const acidRiver2 = this.layoutManager.getAsset("acid_river2")
        const acidRiver3 = this.layoutManager.getAsset("acid_river3")
        
        // Initial Y position
        const initialY = acidRiver1.y;
        acidRiver1.y = initialY;
        acidRiver2.y = initialY;
        acidRiver3.y = initialY;
        
        // acidRiver2.x = acidRiver2.x;
        
        const RIVER_FLOW_SPEED = GAME_CONFIG.SCENES.GAME.RIVER.SPEED_HORIZONTAL*screenWidth;
        const VERTICAL_SPEED = GAME_CONFIG.SCENES.GAME.RIVER.SPEED_VERTICAL*screenHeight;
        const startX1 = acidRiver1.x;
        const startX2 = startX1 - acidRiver1.displayWidth*0.995;
        const startX3 = startX1 - 2*acidRiver1.displayWidth*0.995;
        // const startX2 = acidRiver2.x
        // const startX3 = acidRiver3.x
        const endX = startX1 + acidRiver1.displayWidth*0.995;
        
        const verticalDistance = GAME_CONFIG.SCENES.GAME.RIVER.DISTANCE_VERTICAL*screenHeight; // Keep movement distance constant
        
        let totalverticalDistance = 0
        const createRiverVerticalTween = (river) => {
            // const screenBottom = this.scale.height;
            // const riverBottom = river.y;    
            // if (riverBottom < screenBottom) {
                this.tweens.add({
                    targets: [acidRiver1, acidRiver2,acidRiver3],
                    y: `-=${verticalDistance}`,
                    duration: (verticalDistance / VERTICAL_SPEED) * 1000, // Convert to milliseconds
                    ease: 'Linear',
                    // repeat: -1,
                    onComplete: () => {
                        // river.x = startX2;
                            totalverticalDistance += verticalDistance
                            if (totalverticalDistance < river.displayHeight/2) {
                                createRiverVerticalTween(river);    
                            }
                            
                        }
                    });
                    
        };
        const createRiverTween = (river, startX, endX, flowSpeed) => {
            this.tweens.add({
                targets: river,
                x: { from: startX, to: endX },
                duration: (endX-startX) / flowSpeed * 1000,
                ease: 'Linear',
                onComplete: () => {
                    river.x = startX1- 2*river.displayWidth*.995;
                    createRiverTween(river, river.x, endX, flowSpeed);
                }
            });
        };

        createRiverTween(acidRiver1, startX1, endX, RIVER_FLOW_SPEED);
        createRiverTween(acidRiver2, startX2, endX, RIVER_FLOW_SPEED);
        createRiverTween(acidRiver3, startX3, endX, RIVER_FLOW_SPEED);
        
        createRiverVerticalTween(acidRiver1);
        createRiverVerticalTween(acidRiver2);
        createRiverVerticalTween(acidRiver3);
    };

    setupWave() {
        const screenWidth = this.scale.width;
        const screenHeight = this.scale.height;


        const acidRiver1 = this.layoutManager.getAsset("acid_wave")
        const acidRiver2 = this.layoutManager.getAsset("acid_wave2")
        const acidRiver3 = this.layoutManager.getAsset("acid_wave3")

        const acidBubble11 = this.layoutManager.getAsset("acid_bubble11")
        const acidBubble12 = this.layoutManager.getAsset("acid_bubble12")
        
        acidBubble11.setBlendMode(Phaser.BlendModes.COLOR_DODGE);
        acidBubble12.setBlendMode(Phaser.BlendModes.COLOR_DODGE);
        // acidRiver2.setOrigin(acidRiver1.originX, acidRiver1.originY).setBlendMode(Phaser.BlendModes.COLOR_DODGE);
        // acidRiver3.setOrigin(acidRiver1.originX, acidRiver1.originY).setBlendMode(Phaser.BlendModes.COLOR_DODGE);
        // Initial Y position
        const initialY = acidRiver1.y;
        acidRiver1.y = initialY;
        acidRiver2.y = initialY;
        acidRiver3.y = initialY;
        
        const RIVER_FLOW_SPEED = GAME_CONFIG.SCENES.GAME.WAVE.SPEED_HORIZONTAL*screenWidth;
        const VERTICAL_SPEED = GAME_CONFIG.SCENES.GAME.WAVE.SPEED_VERTICAL*screenHeight;
        const startX1 = acidRiver1.x;
        const startX2 = startX1 - acidRiver1.displayWidth;
        const startX3 = startX1 - 2*acidRiver2.displayWidth;
        const endX = startX1 + acidRiver1.displayWidth;
        
        // acidBubble11.x = -acidBubble11.displayWidth
        // acidBubble11.y = acidRiver1.y
        // acidBubble12.x = acidBubble12.displayWidth
        // acidBubble12.y = acidRiver1.y

        acidBubble11.y = acidRiver1.y
        acidBubble12.x = acidBubble11.x - acidBubble12.displayWidth
        acidBubble12.y = acidRiver2.y 
        const startacidBubble = acidBubble12.x
        const endacidBubble = screenWidth + acidBubble12.displayWidth

        const verticalDistance = GAME_CONFIG.SCENES.GAME.WAVE.DISTANCE_VERTICAL*screenHeight; // Keep movement distance constant
        let totalverticalDistance = 0
        const createRiverVerticalTween = (river) => {
            this.tweens.add({
                targets: [acidRiver1, acidRiver2, acidRiver3,acidBubble11,acidBubble12],
                y: `-=${verticalDistance}`,
                duration: (verticalDistance / VERTICAL_SPEED) * 1000, // Convert to milliseconds
                ease: 'Linear',
                // repeat: -1,
                onComplete: () => {
                    // river.x = startX2;
                        totalverticalDistance += verticalDistance
                        if (totalverticalDistance < screenHeight/2) {
                            createRiverVerticalTween(river);    
                        }
                        
                    }
                });
        };

        const createBubbleTween = (river, startX, endX, flowSpeed) => {
            this.tweens.add({
                targets: river,
                x: { from: startX, to: endX },
                duration: (endX-startX) / flowSpeed * 1000,
                ease: 'Linear',
                onComplete: () => {
                    river.x = startacidBubble;
                    createRiverTween(river, startacidBubble, endX, flowSpeed);
                }
            });
        };

        const createRiverTween = (river, startX, endX, flowSpeed) => {
            this.tweens.add({
                targets: river,
                x: { from: startX, to: endX },
                duration: (endX-startX) / flowSpeed * 1000,
                ease: 'Linear',
                onComplete: () => {
                    river.x = startX3;
                    createRiverTween(river, startX3, endX, flowSpeed);
                }
            });
        };

        createRiverTween(acidRiver1, startX1, endX, RIVER_FLOW_SPEED);
        createRiverTween(acidRiver2, startX2, endX, RIVER_FLOW_SPEED);
        createRiverTween(acidRiver3, startX3, endX, RIVER_FLOW_SPEED);
        
        createBubbleTween(acidBubble11, acidBubble11.x, endacidBubble, RIVER_FLOW_SPEED);
        createBubbleTween(acidBubble12, acidBubble12.x, endacidBubble, RIVER_FLOW_SPEED);
        
        createRiverVerticalTween(acidRiver1);
        createRiverVerticalTween(acidRiver2);
        createRiverVerticalTween(acidRiver3);
        createRiverVerticalTween(acidBubble11);
        createRiverVerticalTween(acidBubble12);
        // acidBubble11.x = 50
        // acidBubble11.y = 50
    }

    setupTank() {
        const screenWidth = this.scale.width;
        const screenHeight = this.scale.height;
        const tank = this.layoutManager.getAsset("black_tank");
        const river = this.layoutManager.getAsset("acid_river");
        
        const config = GAME_CONFIG.SCENES.GAME.TANK;
        
        const createTankAnimation = () => {
            // Random y position near river
            const riverY = tank.y;
            const randomYOffset = Phaser.Math.Between(config.Y_OFFSET_MIN, config.Y_OFFSET_MAX);
            const startY = riverY*(1+ randomYOffset);
            
            // Position tank off-screen left
            tank.x = -4*tank.displayWidth;
            tank.y = startY;
            tank.setScale(0.15)
    
            this.tweens.add({
                targets: tank,
                x: screenWidth - tank.displayWidth,
                duration: (screenWidth + 2 * tank.displayWidth) / config.SPEED_HORIZONTAL/screenWidth* 1000,
                ease: 'Linear',
                onComplete: () => {
                    const delay = Phaser.Math.Between(config.SPAWN_DELAY_MIN, config.SPAWN_DELAY_MAX);
                    this.time.delayedCall(delay, createTankAnimation);
                }
            });
        };
    
        createTankAnimation();
    }
}