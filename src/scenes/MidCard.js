import * as Phaser from '../phaser/phaser-3.87.0-core.js';

import { networkPlugin, adStart, adEnd, adClose, adRetry } from "../networkPlugin.js";
import { config } from "../config.js";
import { GAME_CONFIG } from "./utils/game-config.js";

export class MidCard extends Phaser.Scene {
    constructor() {
        super("MidCard");
    }
    
    editorCreate() {
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;
    
        this.createBackground(gameWidth, gameHeight);
        this.createConfetti(gameWidth, gameHeight);
    }
    
    createBackground(gameWidth, gameHeight) {
        // Background color could also come from config if needed
        this.cameras.main.setBackgroundColor('#F4C542');
    }
    
    createConfetti(gameWidth, gameHeight) {
        const { PARTICLE_CONFIG } = GAME_CONFIG.SCENES.MID_CARD;
    
        // Create a particle emitter
        const particles = this.add.particles(gameWidth/2, gameHeight/2, 'pixel', {
            frame: GAME_CONFIG.COMMON_ASSETS.PIXEL,
            speed: PARTICLE_CONFIG.SPEED,
            angle: { min: 0, max: 360 },
            vx: { min: -0.5, max: 0.5 },
            vy: { min: -1, max: 5 },
            rotation: { delta: 5 },
            scale: { start: 0, end: 1 },
            maxParticles: PARTICLE_CONFIG.MAX_PARTICLES,
            lifespan: PARTICLE_CONFIG.LIFESPAN
        });
    }
    
    create() {
        this.editorCreate();
        // Transition to EndCard scene after the particle emitter finishes
        this.time.delayedCall(GAME_CONFIG.SCENES.MID_CARD.DURATION, () => {
            this.scene.start('EndCard');
        });
    }
}