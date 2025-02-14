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
  "SELECTED_LANGUAGE": "en"
};

// Helper function to get current language config
export const getCurrentLanguage = () => {
    return GAME_CONFIG.LANGUAGES[GAME_CONFIG.SELECTED_LANGUAGE];
};