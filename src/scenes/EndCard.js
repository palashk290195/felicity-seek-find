//src/scenes/EndCard.js
import { Scene } from "phaser";
import { networkPlugin, adStart, adEnd, adClose, adRetry } from "../networkPlugin.js";
import { config } from "../config.js";

export class EndCard extends Scene {
  constructor() {
    super("EndCard");
  }

  editorCreate() {
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;

    this.createBackground(gameWidth, gameHeight);
    this.createHeader(gameWidth, gameHeight);
    this.createPlayButton(gameWidth, gameHeight);
    this.createMaps(gameWidth, gameHeight);
  }

  createBackground(gameWidth, gameHeight) {
    this.background = this.add.image(gameWidth/2, gameHeight/2, "VideoBG");
    const scaleX = gameWidth / this.background.width;
    const scaleY = gameHeight / this.background.height;
    const scale = Math.max(scaleX, scaleY);
    this.background.setScale(scale);
  }

  createHeader(gameWidth, gameHeight) {
    const seekAndFind = this.add.image(
      gameWidth * 0.5,
      gameHeight * 0.05,
      'Logo_image'
    );
    const seekAndFindScale = Math.min(gameWidth, gameHeight) * 0.0015;
    seekAndFind.setScale(seekAndFindScale);
  }

  createPlayButton(gameWidth, gameHeight) {
    const playbtn = this.add.image(
      gameWidth * 0.5,
      gameHeight * 0.9,
      'playbtn'
    );
    const playbtnScale = Math.min(gameWidth, gameHeight) * 0.001;
    
    playbtn
      .setScale(playbtnScale)
      .setInteractive()
      .on('pointerdown', () => {
        adClose(); // Move adClose here, after user clicks
        networkPlugin.ctaPressed();
      });

    this.tweens.add({
      targets: playbtn,
      scale: playbtnScale / 1.1,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  createMaps(gameWidth, gameHeight) {
    const mapPositions = [
        {x: 0.25, y: 0.55},
        {x: 0.5, y: 0.4},
        {x: 0.75, y: 0.55}
    ];

    const mapScale = Math.min(gameWidth, gameHeight) * 0.0008;

    this.map1 = this.add.image(
        gameWidth * mapPositions[0].x,
        gameHeight * mapPositions[0].y,
        'map1'
    ).setScale(mapScale);

    this.map2 = this.add.image(
        gameWidth * mapPositions[1].x,
        gameHeight * mapPositions[1].y,
        'map2'
    ).setScale(mapScale);

    this.map3 = this.add.image(
        gameWidth * mapPositions[2].x,
        gameHeight * mapPositions[2].y,
        'map3'
    ).setScale(mapScale);

    this.createMapMovement(this.map1, [0, 1, 2], gameWidth, gameHeight, mapPositions);
    this.createMapMovement(this.map2, [1, 2, 0], gameWidth, gameHeight, mapPositions);
    this.createMapMovement(this.map3, [2, 0, 1], gameWidth, gameHeight, mapPositions);
  }

  createMapMovement(map, sequence, gameWidth, gameHeight, positions) {
    let currentIndex = 0;

    const startTween = (initial = false) => {
      const index = sequence[currentIndex];
      this.tweens.add({
        targets: map,
        x: gameWidth * positions[index].x,
        y: gameHeight * positions[index].y,
        duration: 1000,
        ease: 'Linear',
        onComplete: () => {
          currentIndex = (currentIndex + 1) % sequence.length;
          const delay = initial ? 0 : 0;
          this.time.delayedCall(delay, () => startTween());
        }
      });
    };

    startTween(true);
  }

  create() {
    this.editorCreate();
    adEnd(); // Keep adEnd, remove adClose
  }
}