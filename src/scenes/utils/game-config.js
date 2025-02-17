import { config } from "../../config.js";
export const GAME_CONFIG = {
  display: {
    dpi: 3,  // DPI multiplier for high-resolution displays
    minDimensions: {
        width: 320,  // Minimum width (will be multiplied by DPI)
        height: 480  // Minimum height (will be multiplied by DPI)
    },
    backgroundColor: "#028af8",
    findText: {
      containerScale: 0.8,  // Scale relative to text-bg
      style: {
        fontFamily: 'Arial',
        fontWeight: 'bold',
        color: '#FFFFFF'
      }
    }
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
    },
    lightningEffect: {
      mainStroke: {
        scale: { min: 0.8, max: 1 },
        rotation: { min: 30, max: 45 },  // Degrees
        duration: { min: 200, max: 300 }
      },
      primaryBranches: {
        count: { min: 2, max: 3 },
        scale: { min: 0.5, max: 0.7 },
        rotation: { min: 15, max: 45 },  // Degrees from main stroke
        delay: { min: 50, max: 100 },    // ms after main stroke
        duration: { min: 150, max: 250 }
      },
      secondaryBranches: {
        count: { min: 1, max: 2 },       // Per primary branch
        scale: { min: 0.3, max: 0.5 },
        rotation: { min: 20, max: 40 },   // Degrees from primary
        delay: { min: 30, max: 80 },      // ms after primary
        duration: { min: 100, max: 200 }
      },
      offshoots: {
        count: { min: 3, max: 5 },        // Total number
        scale: { min: 0.1, max: 0.2 },
        rotation: { min: 0, max: 90 },    // Degrees, full range
        delay: { min: 20, max: 150 },     // ms, random timing
        duration: { min: 50, max: 150 }
      }
    }
  },
  SELECTED_LANGUAGE: "en", //not used, just a fallback
  LANGUAGES: {
    en: {
      game_cta: "Play Free!",
      end_card_cta: "New level!",
      find_text: "Find {count} bombs",
      find_text_singular: "Find {count} bomb",
      find_rabbits: "Find 5 rabbits",
      voiceoverKey: "seek_english_voiceover"
    },
    fr: {
      game_cta: "Jouer Gratuitement!",
      end_card_cta: "Nouveau niveau!",
      find_text: "Trouve {count} bombes",
      find_text_singular: "Trouve {count} bombe",
      find_rabbits: "Trouve 5 lapins",
      voiceoverKey: "seek_french_voiceover"
    },
    ko: {
      game_cta: "무료 플레이!",
      end_card_cta: "새로운 레벨!",
      find_text: "{count}개의 폭탄 찾기",
      find_text_singular: "{count}개의 폭탄 찾기",
      find_rabbits: "5개의 토끼 찾기",
      voiceoverKey: "seek_korean_voiceover"
    },
    jp: {
      game_cta: "無料でプレイ!",
      end_card_cta: "新しいレベル!",
      find_text: "{count}個の爆弾を見つけて",
      find_text_singular: "{count}個の爆弾を見つけて",
      find_rabbits: "5匹のウサギを見つけて",
      voiceoverKey: "seek_japanese_voiceover"
    },
    ru: {
      game_cta: "Играть бесплатно!",
      end_card_cta: "Новый уровень!",
      find_text: "Найди {count} бомбы",
      find_text_singular: "Найди {count} бомбу",
      find_rabbits: "Найди 5 кроликов",
      voiceoverKey: "seek_russian_voiceover"
    },
    pt: {
      game_cta: "Jogue Grátis!",
      end_card_cta: "Novo nível!",
      find_text: "Encontre {count} bombas",
      find_text_singular: "Encontre {count} bomba",
      find_rabbits: "Encontre 5 coelhos",
      voiceoverKey: "seek_portuguese_voiceover"
    },
    de: {
      game_cta: "Kostenlos Spielen!",
      end_card_cta: "Neues Level!",
      find_text: "Finde {count} Bomben",
      find_text_singular: "Finde {count} Bombe",
      find_rabbits: "Finde 5 Hasen",
      voiceoverKey: "seek_german_voiceover"
    }
  }
};

// Helper function to get current language config
export const getCurrentLanguage = () => {
  // First try to get language from config (environment variable)
  if (config.language && GAME_CONFIG.LANGUAGES[config.language]) {
      return GAME_CONFIG.LANGUAGES[config.language];
  }
  // Fall back to default selected language if env variable is not set or invalid
  return GAME_CONFIG.LANGUAGES[GAME_CONFIG.SELECTED_LANGUAGE];
};