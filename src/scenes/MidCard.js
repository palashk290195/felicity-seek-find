//src/scenes/MidCard.js
import { Scene } from "phaser";
import { networkPlugin } from "../networkPlugin.js";
import { config } from "../config.js";

export class MidCard extends Scene {
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
    this.cameras.main.setBackgroundColor('#F4C542'); // Example hex code for yellow
  }

  createConfetti(gameWidth, gameHeight) {

    // Create a particle emitter
    const particles = this.add.particles(gameWidth/2, gameHeight/2, 'pixel', {
      frame: ['pixel_green', 'pixel_white', 'pixel_yellow', 'pixel_blue', 'pixel_red'],
      speed: 50,
      angle: { min: 0, max: 360 },
      vx: { min: -0.5, max: 0.5 },
      vy: { min: -1, max: 5 },
      rotation: { delta: 5 },
      scale: { start: 0, end: 1 },
      maxParticles: 100,
      lifespan: 1000
    });
  }

  create() {
    this.editorCreate();
    // Transition to EndCard scene after the particle emitter finishes
    this.time.delayedCall(1000, () => {
      this.scene.start('EndCard');
    });
  }
}
