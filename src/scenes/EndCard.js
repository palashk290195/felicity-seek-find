//src/scenes/EndCard.js
import { Scene } from "phaser";
import { networkPlugin, adStart, adEnd, adClose, adRetry } from "../networkPlugin.js";
import { config } from "../config.js";

export class EndCard extends Scene {
  constructor() {
    super("EndCard");
  }

  /**
   * Creates all elements for the end card scene
   */
  editorCreate() {
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;

    this.createBackground(gameWidth, gameHeight);
    this.createHeader(gameWidth, gameHeight);
    this.createRetryButton(gameWidth, gameHeight);
    this.createPlayButton(gameWidth, gameHeight);
    this.createMaps(gameWidth, gameHeight);
  }

  /**
   * Creates the background for the end card
   * @param {number} gameWidth - Width of game canvas
   * @param {number} gameHeight - Height of game canvas
   */
  createBackground(gameWidth, gameHeight) {
    this.background = this.add.image(gameWidth/2, gameHeight/2, "VideoBG");
    const scaleX = gameWidth / this.background.width;
    const scaleY = gameHeight / this.background.height;
    const scale = Math.max(scaleX, scaleY);
    this.background.setScale(scale);
  }

  /**
   * Creates the header with logo
   * @param {number} gameWidth - Width of game canvas
   * @param {number} gameHeight - Height of game canvas
   */
  createHeader(gameWidth, gameHeight) {
    const seekAndFind = this.add.image(
      gameWidth * 0.5,
      gameHeight * 0.05,
      'Logo_image'
    );
    const seekAndFindScale = Math.min(gameWidth, gameHeight) * 0.0015;
    seekAndFind.setScale(seekAndFindScale);
  }

  /**
   * Creates retry button in top right corner
   * @param {number} gameWidth - Width of game canvas
   * @param {number} gameHeight - Height of game canvas
   */
  createRetryButton(gameWidth, gameHeight) {
    const padding = 10;
    const buttonSize = 20;
    
    const retryButton = this.add.image(
      gameWidth - padding - buttonSize/2,
      padding + buttonSize/2,
      'retryIcon'
    );

    retryButton.setDisplaySize(buttonSize, buttonSize);
    
    retryButton
      .setInteractive()
      .on('pointerover', () => {
        retryButton.setTint(0x666666);
      })
      .on('pointerout', () => {
        retryButton.clearTint();
      })
      .on('pointerdown', () => {
        adRetry();
        this.scene.start('Game');
      });
  }

  /**
   * Creates main play/install button
   * @param {number} gameWidth - Width of game canvas
   * @param {number} gameHeight - Height of game canvas 
   */
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
        adClose();
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

  /**
   * Creates and animates map elements
   * @param {number} gameWidth - Width of game canvas
   * @param {number} gameHeight - Height of game canvas
   */
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

  /**
   * Creates movement animation for maps
   * @param {Phaser.GameObjects.Image} map - Map sprite to animate
   * @param {Array} sequence - Sequence of position indices
   * @param {number} gameWidth - Width of game canvas
   * @param {number} gameHeight - Height of game canvas
   * @param {Array} positions - Array of position objects
   */
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

  /**
   * Scene create callback
   */
  create() {
    this.editorCreate();
    adEnd();
  }
}