// MidCard.js
import * as Phaser from '../phaser/phaser-3.87.0-core.js';
import { networkPlugin, adStart, adEnd, adClose, adRetry } from "../networkPlugin.js";
import { config } from "../config.js";
import { GAME_CONFIG } from "./utils/game-config.js";

export class MidCard extends Phaser.Scene {
    constructor() {
        super("MidCard");
        this.state = {
            sceneStartTime: 0,
            transitionTimerStarted: false,
            particlesStarted: false
        };
        
        this.particles = null;
        this.sceneTransitionTimer = null;
    }

    logState(event = 'default') {
        console.log(`[MidCard][${event}]`, {
            state: this.state,
            dimensions: {
                width: this.scale.width,
                height: this.scale.height,
                isLandscape: this.scale.width > this.scale.height
            },
            particles: this.particles ? 'active' : 'inactive'
        });
    }

    create() {
        console.log('[MidCard][create] Initializing');
        this.state.sceneStartTime = this.time.now;
        
        this.createSceneElements();
        this.setupResizeHandler();
        this.setupSceneTransition();
        
        this.logState('create');
    }

    createSceneElements() {
        console.log('[MidCard][createSceneElements] Creating UI elements');
        
        // Set background color
        this.cameras.main.setBackgroundColor('#F4C542');
        
        // Create confetti effect
        this.createConfetti();
    }

    createConfetti() {
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;
        const { PARTICLE_CONFIG } = GAME_CONFIG.SCENES.MID_CARD;

        // If particles exist, destroy them first
        if (this.particles) {
            this.particles.destroy();
            this.particles = null;
        }

        // Create new particle emitter
        this.particles = this.add.particles(gameWidth/2, gameHeight/2, 'pixel', {
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

        this.state.particlesStarted = true;
        console.log('[MidCard][createConfetti] Created particle system');
    }

    setupResizeHandler() {
        this.scale.on('resize', this.handleResize, this);
    }

    handleResize(gameSize) {
        console.log('[MidCard][resize] New dimensions:', gameSize);
        
        if (!this.scene.isActive('MidCard')) {
            console.log('[MidCard][resize] Scene not active, skipping resize');
            return;
        }

        // Destroy and recreate all UI elements
        this.destroySceneElements();
        this.createSceneElements();
        
        this.logState('resize');
    }

    destroySceneElements() {
        console.log('[MidCard][destroySceneElements] Cleaning up');
        
        if (this.particles) {
            this.particles.destroy();
            this.particles = null;
        }
        
        // Clear all existing game objects
        this.children.removeAll(true);
    }

    setupSceneTransition() {
        const { DURATION } = GAME_CONFIG.SCENES.MID_CARD;
        const elapsedTime = this.time.now - this.state.sceneStartTime;
        const remainingTime = Math.max(0, DURATION - elapsedTime);

        console.log(`[MidCard][setupSceneTransition] Elapsed: ${elapsedTime}, Remaining: ${remainingTime}`);

        // Only start the transition timer if not already started
        if (!this.state.transitionTimerStarted) {
            this.sceneTransitionTimer = this.time.delayedCall(remainingTime, () => {
                console.log('[MidCard] Transitioning to EndCard scene');
                this.scene.start('EndCard');
            });
            this.state.transitionTimerStarted = true;
        }
    }
}