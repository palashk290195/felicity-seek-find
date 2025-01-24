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

        // Play video
        this.video.play(true);
        this.recalculateScale(this.video_container);

        //setup stream
        this.setupStream()
        // river
        this.setupRiver()
        this.setupWave()
        
    }

    handleResize() {
        this.layoutManager.updateLayout();
    }

    handleWin() {
        // TODO: Implement win state handling
        console.log('Game Won!');
    }

    handleLose() {
        // TODO: Implement lose state handling
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
        const gameAspectRatio = containerWidth / containerHeight;

        let scale;
        if (videoAspectRatio > gameAspectRatio) {
            scale = containerHeight / video_height;
        } else {
            scale = containerWidth / video_width;
        }

        this.video.setScale(scale*5);
    }

    setupStream() {
        const baseAcid = this.layoutManager.getAsset('acid_stream');
        const position = this.layoutManager.getAbsolutePosition(baseAcid);
        const streams = {
            whiteMask1: this.layoutManager.getAsset("stream_mask_white"),
            whiteMask2: this.layoutManager.getAsset("stream_mask_white_2"),
            blackMask1: this.layoutManager.getAsset("stream_mask_black"),
            blackMask2: this.layoutManager.getAsset("stream_mask_black_2")
        };

        // Create mask matching baseAcid
        const maskGraphics = this.make.graphics();
        const width = baseAcid.displayWidth;
    const height = baseAcid.displayHeight;
        const startX = position.x; // Adjust for origin
        const startY = position.y;
        console.log(startX,startY)
        console.log("width,height",width,height)
        maskGraphics.beginPath();
        maskGraphics.fillStyle(0xffffff, 1);
        // maskGraphics.fillRect(startX, startY + height/4, width, height*3/4);
        maskGraphics.fillRect(position.x, position.y+ width/2, width, height);
        maskGraphics.arc(position.x + width/2, position.y + width/2, width/2, Math.PI, 0, false);


        // maskGraphics.setPosition(position.x, position.y);
        maskGraphics.setRotation(position.rotation);
        // maskGraphics.fillRect(position.x, position.y, width, height);
                // maskGraphics.fillStyle(0xffffff, 1); // White color for visibility
        maskGraphics.fillPath(); // Fill the path
        maskGraphics.lineStyle(2, 0xff0000); // Red line for visibility
        maskGraphics.strokePath(); // Stroke the path
        // this.add.existing(maskGraphics);
        const mask = new Phaser.Display.Masks.BitmapMask(this, maskGraphics);

        // Position streams with transforms
        Object.values(streams).forEach(stream => {
            stream.setDisplaySize(width, height);
            stream.setRotation(position.rotation);
            stream.setScale(position.scale.x, position.scale.y);
            stream.setBlendMode(Phaser.BlendModes.ADD);
            stream.setMask(mask);
        });
        
        // Animation setup (keeping existing speeds)
        const FLOW_SPEED_BLACK = GAME_CONFIG.SCENES.GAME.SPEED_STREAM_BLACK;
        const FLOW_SPEED_WHITE = GAME_CONFIG.SCENES.GAME.SPEED_STREAM_WHITE;
        const startY1 = baseAcid.y;
        const startY2 = baseAcid.y - streams.blackMask1.displayHeight;
        const endY = baseAcid.y + streams.blackMask1.displayHeight;
    
        // Set initial positions
        streams.blackMask1.y = startY1;
        streams.blackMask2.y = startY2;
        streams.whiteMask1.y = startY1;
        streams.whiteMask2.y = startY2;
    
        [baseAcid, ...Object.values(streams)].forEach((obj, i) => {
            obj.setDepth(i);
        });
    
        const createTween = (mask, initialY, endY, FLOW_SPEED) => {
            return this.tweens.add({
                targets: mask,
                y: { from: initialY, to: endY },
                duration: (endY - initialY) / FLOW_SPEED * 1000,
                ease: 'Linear',
                onComplete: () => {
                    mask.y = startY2;
                    createTween(mask, startY2, endY, FLOW_SPEED);
                }
            });
        };
    
        [streams.blackMask1, streams.blackMask2].forEach(stream => {
            createTween(stream, stream.y, endY, FLOW_SPEED_BLACK);
        });
        
        [streams.whiteMask1, streams.whiteMask2].forEach(stream => {
            createTween(stream, stream.y, endY, FLOW_SPEED_WHITE);
        });
    }

    setupRiver() {
        const acidRiver1 = this.layoutManager.getAsset("acid_river")
        const acidRiver2 = this.layoutManager.getAsset("acid_river_2")
        acidRiver1.setDepth(100)
        acidRiver2.setDepth(100)
        acidRiver2.setOrigin(acidRiver1.originX, acidRiver1.originY).setBlendMode(Phaser.BlendModes.COLOR_DODGE);
        
        // Initial Y position
        const initialY = acidRiver1.y;
        acidRiver1.y = initialY;
        acidRiver2.y = initialY;
        
        const RIVER_FLOW_SPEED = GAME_CONFIG.SCENES.GAME.RIVER.SPEED_HORIZONTAL;
        const VERTICAL_SPEED = GAME_CONFIG.SCENES.GAME.RIVER.SPEED_VERTICAL;
        const startX1 = acidRiver1.x;
        const startX2 = startX1 - acidRiver1.displayWidth + 27;
        const endX = startX1 + acidRiver1.displayWidth - 27;
        
        const verticalDistance = GAME_CONFIG.SCENES.GAME.RIVER.DISTANCE_VERTICAL; // Keep movement distance constant
        const createRiverVerticalTween = (river) => {
            this.tweens.add({
                targets: [acidRiver1, acidRiver2],
                y: `-=${verticalDistance}`,
                duration: (verticalDistance / VERTICAL_SPEED) * 1000, // Convert to milliseconds
                ease: 'Linear',
                // repeat: -1,
                onComplete: () => {
                    // river.x = startX2;
                    createRiverVerticalTween(river);
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
                    river.x = startX2;
                    createRiverTween(river, startX2, endX, flowSpeed);
                }
            });
        };

        createRiverTween(acidRiver1, startX1, endX, RIVER_FLOW_SPEED);
        createRiverTween(acidRiver2, startX2, endX, RIVER_FLOW_SPEED);
        createRiverVerticalTween(acidRiver1);
        createRiverVerticalTween(acidRiver2);
    }

    setupWave() {
        const acidRiver1 = this.layoutManager.getAsset("acid_wave")
        const acidRiver2 = this.layoutManager.getAsset("acid_wave_2")
        acidRiver1.setDepth(100)
        acidRiver2.setDepth(100)
        acidRiver2.setOrigin(acidRiver1.originX, acidRiver1.originY).setBlendMode(Phaser.BlendModes.COLOR_DODGE);
        
        // Initial Y position
        const initialY = acidRiver1.y;
        acidRiver1.y = initialY;
        acidRiver2.y = initialY;
        
        const RIVER_FLOW_SPEED = GAME_CONFIG.SCENES.GAME.WAVE.SPEED_HORIZONTAL;
        const VERTICAL_SPEED = GAME_CONFIG.SCENES.GAME.WAVE.SPEED_VERTICAL;
        const startX1 = acidRiver1.x;
        const startX2 = startX1 - acidRiver1.displayWidth + 27;
        const endX = startX1 + acidRiver1.displayWidth - 27;
        
        const verticalDistance = GAME_CONFIG.SCENES.GAME.WAVE.DISTANCE_VERTICAL; // Keep movement distance constant
        const createRiverVerticalTween = (river) => {
            this.tweens.add({
                targets: [acidRiver1, acidRiver2],
                y: `-=${verticalDistance}`,
                duration: (verticalDistance / VERTICAL_SPEED) * 1000, // Convert to milliseconds
                ease: 'Linear',
                // repeat: -1,
                onComplete: () => {
                    // river.x = startX2;
                    createRiverVerticalTween(river);
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
                    river.x = startX2;
                    createRiverTween(river, startX2, endX, flowSpeed);
                }
            });
        };

        createRiverTween(acidRiver1, startX1, endX, RIVER_FLOW_SPEED);
        createRiverTween(acidRiver2, startX2, endX, RIVER_FLOW_SPEED);
        createRiverVerticalTween(acidRiver1);
        createRiverVerticalTween(acidRiver2);
    }
}