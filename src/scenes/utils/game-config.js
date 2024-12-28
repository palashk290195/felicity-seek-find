export const GAME_CONFIG = {
    START_CARD: {
        SCENE_DURATION: 5000, // Total scene duration
        ENTRY_DURATION: 2000, // Time to reach center
        WIGGLE_DURATION: 500,
        EXIT_DURATION: 2000,
        CHARACTER: {
          PORTRAIT: {
            WIDTH: 0.9,
            HEIGHT: 0.7,
            X: 0.5,
            Y: 0.6
          },
          LANDSCAPE: {
            WIDTH: 0.6,
            HEIGHT: 0.5,
            X: 0.5,
            Y: 0.5
          }
        },
        TEXT: {
          PORTRAIT: {
            WIDTH: 0.8,
            HEIGHT: 0.1,
            Y: 0.3
          },
          LANDSCAPE: {
            WIDTH: 0.5,
            HEIGHT: 0.1,
            Y: 0.1
          },
          CONTENT: {
            en: "Where is Bear?"
            // Add more languages as needed
          }
        }
    },
    DUCK_CONTAINER_SIZE_RATIO: 0.15, // Ratio of Min(GameWidth, GameHeight)
    AUDIO: {
        BG_MUSIC_VOLUME: 0.9 // Volume for suspense theme. 1 is standard.
    }
};