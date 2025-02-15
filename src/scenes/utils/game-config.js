export const GAME_CONFIG = {
  display: {
    dpi: 3,  // DPI multiplier for high-resolution displays
    minDimensions: {
        width: 320,  // Minimum width (will be multiplied by DPI)
        height: 480  // Minimum height (will be multiplied by DPI)
    },
    backgroundColor: "#028af8"
  },
  animation: {
    containerShakeDistance: 0.1,  // Relative to min(width, height)
    hintCircle: {
      size: 0.8,  // Scale relative to target object size
      duration: 500,  // Duration in ms (2x faster than before)
      scaleUp: 1.2,  // Scale multiplier for the tween
      nextObjectDelay: 2000  // Delay in ms before moving to next object
    },
    wrongClick: {
      crossSize: 0.1,  // Size relative to min(width, height)
      duration: 1000,  // Duration for cross fade
      shake: {
        intensity: 0.01,  // Shake distance relative to min(width, height)
        duration: 200,   // Duration of shake
        ease: 'Cubic.easeOut'  // Easing function for shake
      }
    },
    spiderEffect: {
      initialDuration: 1000,  // Duration for initial animation
      pendulumDuration: 1000,  // Duration for one complete pendulum swing
      pendulumAngle: 20,      // Maximum angle of swing in degrees
      fadeInDuration: 500     // Duration for alpha transitions
    },
    lampHighlightEffect: {
      rotationAngle: 55,      // Rotation angle in degrees
      flashCount: 10,         // Number of flashes
      flashDuration: {
        min: 0,               // Minimum flash duration in ms
        max: 100             // Maximum flash duration in ms
      }
    },
    orangeLightEffect: {
      lightballsDuration: 1000  // Duration for each lightball visibility toggle in ms
    },
    handEffect: {
      initialDuration: 1000,    // Duration for initial upward movement
      initialOffset: 0.3,       // Initial Y offset relative to game height
      pendulumDuration: 1000,   // Duration for one complete pendulum swing
      pendulumAngle: 5,        // Maximum angle of swing in degrees
    },
    horrorCharacterEffect: {
      initialDuration: 1000,    // Duration for character movement
      positionOffset: 0.1,      // Initial X offset relative to character width
      bloodAlphaDuration: 500,  // Duration for blood alpha animation
      bloodInitialAlpha: 0.5    // Starting alpha for blood
    }
  },
  SELECTED_LANGUAGE: "en",
  LANGUAGES: {
    en: {
      game_cta: "Play Free!",
      end_card_cta: "New level!"
    },
    fr: {
      game_cta: "Jouer Gratuitement!",
      end_card_cta: "Nouveau niveau!"
    },
    ko: {
      game_cta: "무료 플레이!",
      end_card_cta: "새로운 레벨!"
    },
    jp: {
      game_cta: "無料でプレイ!",
      end_card_cta: "新しいレベル!"
    },
    ru: {
      game_cta: "Играть бесплатно!",
      end_card_cta: "Новый уровень!"
    },
    pt: {
      game_cta: "Jogue Grátis!",
      end_card_cta: "Novo nível!"
    },
    de: {
      game_cta: "Kostenlos Spielen!",
      end_card_cta: "Neues Level!"
    }
  }
};

// Helper function to get current language config
export const getCurrentLanguage = () => {
    return GAME_CONFIG.LANGUAGES[GAME_CONFIG.SELECTED_LANGUAGE];
};