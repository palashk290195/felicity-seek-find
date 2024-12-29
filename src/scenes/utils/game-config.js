// game-config.js

export const GAME_CONFIG = {
    // Selected language for the game
    SELECTED_LANGUAGE: 'en',

    // Selected theme for the game
    SELECTED_THEME: 'DEFAULT', // Can be DEFAULT, CHRISTMAS, WINTER, CITY

    // Common assets across all languages
    COMMON_ASSETS: {
        LOGO: 'Logo_image',
        RETRY_ICON: 'retryIcon',
        STAR: 'star',
        SCENE_BACKGROUNDS: {
            START_CARD: {
                DEFAULT: 'VideoBG',
                CHRISTMAS: 'VideoBG',
                WINTER: 'VideoBG',
                CITY: 'VideoBG'
            },
            GAME: {
                DEFAULT: 'map_outlined_HQ',
                CHRISTMAS: 'christmas_map_outlined',
                WINTER: 'winter_map_outlined',
                CITY: 'city_map_outlined'
            },
            END_CARD: {
                DEFAULT: 'VideoBG',
                CHRISTMAS: 'VideoBG',
                WINTER: 'VideoBG',
                CITY: 'VideoBG'
            }
        },
        PIXEL: ['pixel_green', 'pixel_white', 'pixel_yellow', 'pixel_blue', 'pixel_red'],
        CHARACTER: 'duck_colored',
        CHARACTER_OUTLINE: 'duck_outline',
        DUCK_CLICK_SOUND: 'duck_click_sound'
    },

    // Language specific configurations
    LANGUAGES: {
        en: {
            ASSETS: {
                PLAY_BTN: 'playbtn_en',
                PLAY_NOW: 'playnow_en',
                VOICEOVER: 'seek_english_voiceover',
            },
            TEXT: {
                TITLE: "Where is the bear?",
                HEADER: "\"I've tried 353 times but still can't find all 100 Bears\""
            }
        },
        ru: {
            ASSETS: {
                PLAY_BTN: 'playbtn_ru',
                PLAY_NOW: 'playnow_ru',
                VOICEOVER: 'seek_russian_voiceover',
            },
            TEXT: {
                TITLE: "Где медведь?",
                HEADER: "\"Я пробовал 353 раза, но до сих пор не могу найти всех 100 медведей.\""
            }
        },
        ja: {
            ASSETS: {
                PLAY_BTN: 'playbtn_ja',
                PLAY_NOW: 'playnow_ja',
                VOICEOVER: 'seek_japanese_voiceover',
            },
            TEXT: {
                TITLE: "熊はどこですか？",
                HEADER: "\"353回試しましたが、まだ100匹すべてのクマを見つけることができません\""
            }
        },
        de: {
            ASSETS: {
                PLAY_BTN: 'playbtn_de',
                PLAY_NOW: 'playnow_de',
                VOICEOVER: 'seek_german_voiceover',
            },
            TEXT: {
                TITLE: "Wo ist die Ente?",
                HEADER: "\"Ich habe es 353 Mal versucht, aber ich kann immer noch nicht \nAlle 100 Enten finden.\""
            }
        }
    },

    // Layout configurations
    LAYOUT: {
        HEADER_HEIGHT_RATIO: 0.08,  // Ratio of game height
        BUTTON_SCALE_RATIO: 0.0007,  // Scale relative to min(gameWidth, gameHeight)
        CHARACTER_CONTAINER_SIZE_RATIO: 0.15  // Size ratio relative to min(gameWidth, gameHeight)
    },

    // Scene specific configurations
    SCENES: {
        START_CARD: {
            SCENE_DURATION: 5000,
            ENTRY_DURATION: 2000,
            WIGGLE_DURATION: 500,
            EXIT_DURATION: 2000,
            CHARACTER: {
                PORTRAIT: {
                    WIDTH: 0.9,   // Ratio of game width
                    HEIGHT: 0.7,  // Ratio of game height
                    X: 0.5,      // Ratio of game width
                    Y: 0.6       // Ratio of game height
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
                }
            }
        },
        GAME: {
            DURATION: 300,  // seconds
            DUCKS_TO_FIND: 5,
            TARGET_POSITION: { x: 0.15, y: 0.3 },  // Ratio of game dimensions
            PLAY_BUTTON_Y: 0.85,  // Position in ratio of game height
            // Character positions relative to game dimensions (width, height)
            CHARACTER_POSITIONS: [
                {x: 0.5, y: 0.5}, {x: 0.4, y: 0.43}, {x: 0.6, y: 0.22},  // Top cluster
                {x: 0.15, y: 0.3}, {x: 0.25, y: 0.45}, {x: 0.1, y: 0.6}, // Left cluster
                {x: 0.4, y: 0.35}, {x: 0.5, y: 0.5}, {x: 0.45, y: 0.65}, // Center cluster
                {x: 0.7, y: 0.25}, {x: 0.8, y: 0.4}, {x: 0.75, y: 0.55}, // Right cluster
                {x: 0.3, y: 0.75}, {x: 0.5, y: 0.75}, {x: 0.7, y: 0.75}, // Bottom row 1
                {x: 0.2, y: 0.92}, {x: 0.4, y: 0.93}, {x: 0.6, y: 0.94}, // Bottom row 2
                {x: 0.8, y: 0.5}, {x: 0.9, y: 0.94}                      // Far right
            ]
        },
        MID_CARD: {
            DURATION: 1000,  // milliseconds
            PARTICLE_CONFIG: {
                SPEED: 50,
                MAX_PARTICLES: 100,
                LIFESPAN: 1000
            }
        },
        END_CARD: {
            BUTTON_SCALE_RATIO: 0.001,  // Scale relative to min(gameWidth, gameHeight)
            LOGO_SCALE_RATIO: 0.0015    // Scale relative to min(gameWidth, gameHeight)
        }
    },

    // Audio configurations
    AUDIO: {
        BG_MUSIC_VOLUME: 0.9
    }
};

// Helper function to get current language config
export const getCurrentLanguage = () => {
    return GAME_CONFIG.LANGUAGES[GAME_CONFIG.SELECTED_LANGUAGE];
};

// Helper function to get scene specific background based on theme
export const getSceneBackground = (sceneName) => {
    return GAME_CONFIG.COMMON_ASSETS.SCENE_BACKGROUNDS[sceneName][GAME_CONFIG.SELECTED_THEME];
};