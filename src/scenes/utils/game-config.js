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
  LANGUAGES: {
    "en": {
      code: "en",
      findTextKey: "find-text-english",
      voiceoverKey: "seek_english_voiceover",
      playMoreKey: "play-more-en"
    },
    "fr": {
      code: "fr",
      findTextKey: "find-text-french",
      voiceoverKey: "seek_french_voiceover",
      playMoreKey: "play-more-fr"
    },
    "de": {
      code: "de",
      findTextKey: "find-text-german",
      voiceoverKey: "seek_german_voiceover",
      playMoreKey: "play-more-de"
    },
    "jp": {
      code: "jp",
      findTextKey: "find-text-japanese",
      voiceoverKey: "seek_japanese_voiceover",
      playMoreKey: "play-more-jp"
    },
    "ko": {
      code: "ko",
      findTextKey: "find-text-korean",
      voiceoverKey: "seek_korean_voiceover",
      playMoreKey: "play-more-ko"
    },
    "pt": {
      code: "pt",
      findTextKey: "find-text-portuguese",
      voiceoverKey: "seek_portuguese_voiceover",
      playMoreKey: "play-more-pt"
    },
    "ru": {
      code: "ru",
      findTextKey: "find-text-russian",
      voiceoverKey: "seek_russian_voiceover",
      playMoreKey: "play-more-ru"
    }
  },
  "SELECTED_LANGUAGE": "en"//this is fallback, not used
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