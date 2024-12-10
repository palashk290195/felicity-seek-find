//src/scenes/Game.js
import { Scene } from "phaser";
import { networkPlugin, adStart, adEnd, adClose, adRetry } from "../networkPlugin.js";
import { config } from "../config.js";

export class Game extends Scene {
  constructor() {
    super("Game");
    this.TOP_SPACE_PERCENTAGE = 0.1; // Reduced for better space utilization
    this.TARGET_DUCK_POSITION = { x: 0.15, y: 0.3 }; // Mid top left position
    this.GAME_DURATION = 300; // 300 seconds
    this.DUCKS_TO_FIND = 5;
    this.ducksFound = 0;
    this.gameTimer = null;
    this.headerHeight = 0;
  }

  init() {
    adStart();
  }

  editorCreate() {
    this.cameras.main.setBackgroundColor('#ffffff');
    
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;

    this.createHeader(gameWidth, gameHeight);
    this.createBackground(gameWidth, gameHeight);
    
    this.createDucks(gameWidth, gameHeight);
    this.createPointer(gameWidth, gameHeight);
    this.createPlayNowButton(gameWidth, gameHeight);
    this.startGameTimer();
    // Handle resize
    // this.scale.on('resize', this.handleResize, this);
  }

  startGameTimer() {
    this.gameTimer = this.time.addEvent({
      delay: this.GAME_DURATION * 1000,
      callback: () => this.scene.start('EndCard'),
      callbackScope: this
    });
  }

  createPointer(gameWidth, gameHeight) {
    // Calculate pointer position based on target duck position
    const pointerX = gameWidth * this.TARGET_DUCK_POSITION.x;
    const pointerY = gameHeight * this.TARGET_DUCK_POSITION.y;

    // Calculate base scale relative to game dimensions
    const baseScale = Math.min(gameWidth, gameHeight) * 0.0002;
    
    this.pointer = this.add.image(pointerX, pointerY, 'Cursor_1')
      .setScale(baseScale)
      .setDepth(2)
      .setOrigin(0,0);
    
    // Tween with relative scale changes
    this.pointerTween = this.tweens.add({
      targets: this.pointer,
      scale: baseScale * 1.2, // 40% larger than base scale
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  scaleBackground(width, gameHeight, availableHeight, headerHeight) {
    // Calculate the scale factors for width and height
    const scaleX = width / this.background.width;
    const scaleY = availableHeight / this.background.height;

    // Use the larger scale to ensure the background covers the remaining space
    const scale = Math.max(scaleX, scaleY);

    // Set the scale of the background
    this.background.setScale(scale);

    this.background.setOrigin(0.5,0);
    this.background.setPosition(width / 2, headerHeight);
    console.log(headerHeight, gameHeight);
  }

  createBackground(gameWidth, gameHeight) {
    // Calculate the top space based on the header container's height
    const headerHeight = this.headerHeight;
    const topSpace = headerHeight;

    // Create a container for the game elements below the header
    this.gameContainer = this.add.container(0, topSpace);

    // Add and position the background image
    this.background = this.add.image(gameWidth / 2, (gameHeight - topSpace) / 2 + topSpace, "map_outlined_HQ");
    this.gameContainer.add(this.background);

    // Scale the background to cover the entire area below the header
    this.scaleBackground(gameWidth, gameHeight, gameHeight - topSpace, headerHeight);
  }

  createHeader(gameWidth, gameHeight) {
    // Create single container for header

    // Calculate font size based on device width for consistency
    const fontSize = Math.min(gameWidth * 0.04, gameHeight * 0.04 , 24); // Cap maximum size
    const textStyle = {
      fontSize: `${fontSize}px`,
      fill: '#000000',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold'
    };
    console.log(fontSize);

    // Add main text in two lines
    const headerTextLine1 = this.add.text(0, 0, 
      '"I\'ve tried 464 times but still can\'t', 
      textStyle
    ).setOrigin(0.5, 0);

    const headerTextLine2 = this.add.text(0, fontSize, 
      'Find all', 
      textStyle
    ).setOrigin(0.5, 0);

    // Add "100" with different color
    const numberText = this.add.text(
      headerTextLine2.width / 2 + fontSize * 0.3,
      fontSize,
      '100"',
      {
        ...textStyle,
        fill: '#ff9900' // Golden color for emphasis
      }
    ).setOrigin(0, 0);

    // Add duck icon right after the text
    // Add duck icon right after the text
    const duck = this.add.image(
      numberText.x + numberText.width + fontSize,
      fontSize,
      'duck_colored'
    );

    // Set the scale to make the duck's height equal to the font size
    duck.setScale(fontSize / duck.height);

    // Adjust the position of the duck to avoid overlap
    duck.setY(fontSize * 1.5);

    // Create a container for the header elements
    const headerElementsContainer = this.add.container(gameWidth / 2, 0, [
      headerTextLine1, headerTextLine2, numberText, duck
    ]);

    // Store the height of the container in a class property
    this.headerHeight = headerElementsContainer.getBounds().height;
    console.log('Container Height:', this.headerHeight);

    // Tween the entire container
    this.tweens.add({
      targets: headerElementsContainer, // Ensure the correct target is used
      scale: { from: 0, to: 1 },
      duration: 1000,
      ease: 'Power2'
    });
  }

  createDucks(gameWidth, gameHeight) {
    // Duck positions
    const duckPositions = [
      {x: 0.5, y: 0.5}, {x: 0.4, y: 0.43}, {x: 0.6, y: 0.22},
      {x: 0.15, y: 0.3}, {x: 0.25, y: 0.45}, {x: 0.1, y: 0.6},
      {x: 0.4, y: 0.35}, {x: 0.5, y: 0.5}, {x: 0.45, y: 0.65},
      {x: 0.7, y: 0.25}, {x: 0.8, y: 0.4}, {x: 0.75, y: 0.55},
      {x: 0.3, y: 0.75}, {x: 0.5, y: 0.75}, {x: 0.7, y: 0.75},
      {x: 0.2, y: 0.92}, {x: 0.4, y: 0.93}, {x: 0.6, y: 0.94},
      {x: 0.8, y: 0.5}, {x: 0.9, y: 0.94}
    ];

    // Create ducks
    this.ducks = duckPositions.map(pos => {
      const duck = this.add.image(
        gameWidth * pos.x,
        gameHeight * pos.y,
        'duck_outline'
      );
      const duckScale = Math.min(gameWidth, gameHeight) * 0.001;
      duck.setScale(duckScale);
      duck.setInteractive();
      duck.on('pointerdown', () => this.handleDuckClick(duck));
      // this.gameContainer.add(duck);
      return duck;
    });
  }

  handleDuckClick(duck) {
    // Remove pointer
    if (this.pointer) {
      this.pointer.destroy();
      this.pointerTween.stop();
    }

    // Play sound when duck is clicked
    try {
      const sound = this.sound.add('duck_click_sound');
      sound.play();
    } catch (error) {
      console.error('Audio decode error:', error);
    }

    // Replace outline duck with colored duck
    const coloredDuck = this.add.image(duck.x, duck.y, 'duck_colored')
      .setScale(duck.scale);
    duck.destroy();




    // Create a particle emitter
    const particles = this.add.particles(coloredDuck.x, coloredDuck.y, 'star', {
      speed: 30,
      angle: { min: 0, max: 360 },
      scale: {start: 0.5, end: 0},
      maxParticles: 10,
      lifespan: 1000
    });

    this.ducksFound++;
    if (this.ducksFound >= this.DUCKS_TO_FIND) {
      this.scene.start('MidCard');
    }
  }

  createPlayNowButton(gameWidth, gameHeight) {
    // Position the button at the bottom center, slightly up from bottom
    const buttonY = gameHeight * 0.85;
    this.playNowButton = this.add.image(gameWidth / 2, buttonY, 'PlayNow')
      .setInteractive()
      .setDepth(3); // Ensure button is above ducks

    const playNowButtonScale = Math.min(gameWidth, gameHeight) * 0.001;
    this.playNowButton.setScale(playNowButtonScale);

    this.playNowButton.on('pointerdown', () => {
      networkPlugin.ctaPressed();
    });

    this.tweens.add({
      targets: this.playNowButton, // Ensure the correct target is used
      scale: { from: 0, to: playNowButtonScale },
      duration: 1000,
      ease: 'Power2'
    });
  }

  create() {
    this.editorCreate();
  }
}
