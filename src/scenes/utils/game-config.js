import { config } from '../../config.js';

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
    shelfMoveDistance: 0.45,  // Relative to min(width, height)
    containerShakeDistance: 0.1  // Relative to min(width, height)
  },
  SELECTED_LANGUAGE: "en", //this is fallback, not used
  LANGUAGES: {
    en: {
      game_cta: "Play Free!",
      end_card_cta: "New level!",
      voiceover_key: "seek_english_voiceover"
    },
    fr: {
      game_cta: "Jouer Gratuitement!",
      end_card_cta: "Nouveau niveau!",
      voiceover_key: "seek_french_voiceover"
    },
    ko: {
      game_cta: "무료 플레이!",
      end_card_cta: "새로운 레벨!",
      voiceover_key: "seek_korean_voiceover"
    },
    jp: {
      game_cta: "無料でプレイ!",
      end_card_cta: "新しいレベル!",
      voiceover_key: "seek_japanese_voiceover"
    },
    ru: {
      game_cta: "Играть бесплатно!",
      end_card_cta: "Новый уровень!",
      voiceover_key: "seek_russian_voiceover"
    },
    pt: {
      game_cta: "Jogue Grátis!",
      end_card_cta: "Novo nível!",
      voiceover_key: "seek_portuguese_voiceover"
    },
    de: {
      game_cta: "Kostenlos Spielen!",
      end_card_cta: "Neues Level!",
      voiceover_key: "seek_german_voiceover"
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