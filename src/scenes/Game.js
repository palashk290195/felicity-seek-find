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


export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
        this.layoutManager = null;
        this.gameStateManager = null;
        this.heartManager = null;
        this.benchManager = null;
        this.tutorialManager = null;
        this.waldoManager = null;
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

        // Initialize Waldo manager (animations start immediately)
        this.waldoManager = new WaldoManager(this, this.layoutManager);

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
        video.setScale(video.scaleX / 2.8, video.scaleY / 1.8);
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
        this.layoutManager.updateLayout();
        this.setupRiver();
        this.setupStream();
        this.setupStream();
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
        
        const FLOW_SPEED_BLACK = GAME_CONFIG.SCENES.GAME.SPEED_STREAM_BLACK;
        const FLOW_SPEED_WHITE = GAME_CONFIG.SCENES.GAME.SPEED_STREAM_WHITE;
        
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
        const acidRiver1 = this.layoutManager.getAsset("acid_river")
        const acidRiver2 = this.layoutManager.getAsset("acid_river2")
        const acidRiver3 = this.layoutManager.getAsset("acid_river3")
        
        // Initial Y position
        const initialY = acidRiver1.y;
        acidRiver1.y = initialY;
        acidRiver2.y = initialY;
        acidRiver3.y = initialY;
        
        // acidRiver2.x = acidRiver2.x;
        
        const RIVER_FLOW_SPEED = GAME_CONFIG.SCENES.GAME.RIVER.SPEED_HORIZONTAL;
        const VERTICAL_SPEED = GAME_CONFIG.SCENES.GAME.RIVER.SPEED_VERTICAL;
        const startX1 = acidRiver1.x;
        const startX2 = startX1 - acidRiver1.displayWidth*0.995;
        const startX3 = startX1 - 2*acidRiver1.displayWidth*0.995;
        // const startX2 = acidRiver2.x
        // const startX3 = acidRiver3.x
        const endX = startX1 + acidRiver1.displayWidth*0.995;
        
        const verticalDistance = GAME_CONFIG.SCENES.GAME.RIVER.DISTANCE_VERTICAL; // Keep movement distance constant
        
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
                            if (totalverticalDistance < river.displayHeight*0.5) {
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
        const acidRiver1 = this.layoutManager.getAsset("acid_wave")
        const acidRiver2 = this.layoutManager.getAsset("acid_wave2")
        const acidRiver3 = this.layoutManager.getAsset("acid_wave3")
        
        acidRiver2.setOrigin(acidRiver1.originX, acidRiver1.originY).setBlendMode(Phaser.BlendModes.COLOR_DODGE);
        acidRiver3.setOrigin(acidRiver1.originX, acidRiver1.originY).setBlendMode(Phaser.BlendModes.COLOR_DODGE);
        // Initial Y position
        const initialY = acidRiver1.y;
        acidRiver1.y = initialY;
        acidRiver2.y = initialY;
        acidRiver3.y = initialY;
        
        const RIVER_FLOW_SPEED = GAME_CONFIG.SCENES.GAME.WAVE.SPEED_HORIZONTAL;
        const VERTICAL_SPEED = GAME_CONFIG.SCENES.GAME.WAVE.SPEED_VERTICAL;
        const startX1 = acidRiver1.x;
        const startX2 = startX1 - acidRiver1.displayWidth + 1;
        const startX3 = startX2 - acidRiver2.displayWidth + 1;
        const endX = startX1 + acidRiver1.displayWidth;
        
        const verticalDistance = GAME_CONFIG.SCENES.GAME.WAVE.DISTANCE_VERTICAL; // Keep movement distance constant
        let totalverticalDistance = 0
        const createRiverVerticalTween = (river) => {
            this.tweens.add({
                targets: [acidRiver1, acidRiver2, acidRiver3],
                y: `-=${verticalDistance}`,
                duration: (verticalDistance / VERTICAL_SPEED) * 1000, // Convert to milliseconds
                ease: 'Linear',
                // repeat: -1,
                onComplete: () => {
                    // river.x = startX2;
                        totalverticalDistance += verticalDistance
                        if (totalverticalDistance < river.displayHeight) {
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
                    river.x = startX3;
                    createRiverTween(river, startX3, endX, flowSpeed);
                }
            });
        };

        createRiverTween(acidRiver1, startX1, endX, RIVER_FLOW_SPEED);
        createRiverTween(acidRiver2, startX2, endX, RIVER_FLOW_SPEED);
        createRiverTween(acidRiver3, startX3, endX, RIVER_FLOW_SPEED);
        createRiverVerticalTween(acidRiver1);
        createRiverVerticalTween(acidRiver2);
        createRiverVerticalTween(acidRiver3);
    }

    setupTank() {
        const tank = this.layoutManager.getAsset("black_tank")
        tank.x = 50
        tank.y = 50
    }
}