export const GAME_CONFIG = {
  "SELECTED_LANGUAGE": "en",
  "SELECTED_THEME": "DEFAULT",
  "COMMON_ASSETS": {
    "LOGO": "Logo_image",
    "RETRY_ICON": "retryIcon",
    "STAR": "star",
    "SCENE_BACKGROUNDS": {
      "START_CARD": {
        "DEFAULT": "VideoBG",
        "CHRISTMAS": "VideoBG",
        "WINTER": "VideoBG",
        "CITY": "VideoBG"
      },
      "GAME": {
        "DEFAULT": "map_outlined_HQ",
        "CHRISTMAS": "christmas_map_outlined",
        "WINTER": "winter_map_outlined",
        "CITY": "city_map_outlined"
      },
      "END_CARD": {
        "DEFAULT": "VideoBG",
        "CHRISTMAS": "VideoBG",
        "WINTER": "VideoBG",
        "CITY": "VideoBG"
      }
    },
    "PIXEL": [
      "pixel_green",
      "pixel_white",
      "pixel_yellow",
      "pixel_blue",
      "pixel_red"
    ],
    "CHARACTER": "duck_colored",
    "CHARACTER_OUTLINE": "duck_outline",
    "DUCK_CLICK_SOUND": "duck_click_sound",
    "BG_MUSIC": "seek_bg_music"
  },
  "LANGUAGES": {
    "en": {
      "ASSETS": {
        "PLAY_BTN": "playbtn_en",
        "PLAY_NOW": "playnow_en",
        "VOICEOVER": "seek_english_voiceover"
      },
      "TEXT": {
        "TITLE": "The Hunt is On! Search for the Legendary Ball!",
        "HEADER": "\"I've tried 353 times but still can't find all 100 Rugby Balls\""
      }
    },
    "ru": {
      "ASSETS": {
        "PLAY_BTN": "playbtn_ru",
        "PLAY_NOW": "playnow_ru",
        "VOICEOVER": "seek_russian_voiceover"
      },
      "TEXT": {
        "TITLE": "Охота началась! Ищи легендарный мяч!",
        "HEADER": "\"Я пытался 353 раза, но всё ещё не могу найти все 100 регбийных мячей\""
      }
    },
    "ja": {
      "ASSETS": {
        "PLAY_BTN": "playbtn_ja",
        "PLAY_NOW": "playnow_ja",
        "VOICEOVER": "seek_japanese_voiceover"
      },
      "TEXT": {
        "TITLE": "狩りが始まった！伝説のボールを探せ！",
        "HEADER": "「353回挑戦したけど、まだ100個のラグビーボールを全部見つけられない」"
      }
    },
    "de": {
      "ASSETS": {
        "PLAY_BTN": "playbtn_de",
        "PLAY_NOW": "playnow_de",
        "VOICEOVER": "seek_german_voiceover"
      },
      "TEXT": {
        "TITLE": "Die Jagd beginnt! Suche den legendären Ball!",
        "HEADER": "\"Ich habe es 353 Mal versucht, aber ich kann immer noch nicht alle 100 Rugbybälle finden.\""
      }
    }
  },
  "LAYOUT": {
    "HEADER_HEIGHT_RATIO": 0.08,
    "BUTTON_SCALE_RATIO": 0.0007,
    "CHARACTER_CONTAINER_SIZE_RATIO": 0.1
  },
  "SCENES": {
    "START_CARD": {
      "SCENE_DURATION": 5000,
      "ENTRY_DURATION": 2000,
      "WIGGLE_DURATION": 500,
      "EXIT_DURATION": 2000,
      "CHARACTER": {
        "PORTRAIT": {
          "WIDTH": 0.9,
          "HEIGHT": 0.7,
          "X": 0.5,
          "Y": 0.6
        },
        "LANDSCAPE": {
          "WIDTH": 0.6,
          "HEIGHT": 0.5,
          "X": 0.5,
          "Y": 0.5
        }
      },
      "TEXT": {
        "PORTRAIT": {
          "WIDTH": 0.8,
          "HEIGHT": 0.1,
          "Y": 0.3
        },
        "LANDSCAPE": {
          "WIDTH": 0.5,
          "HEIGHT": 0.1,
          "Y": 0.1
        }
      }
    },
    "GAME": {
      "DURATION": 299,
      "DUCKS_TO_FIND": 5,
      "USE_SEPARATE_POSITIONS": false,
      "TARGET_POSITION": {
        "x": 0.338,
        "y": 0.141
      },
      "PLAY_BUTTON_Y": 0.85,
      "CHARACTER_POSITIONS": [
        {
          "x": 0.21,
          "y": 0.146
        },
        {
          "x": 0.338,
          "y": 0.141
        },
        {
          "x": 0.492,
          "y": 0.128
        },
        {
          "x": 0.389,
          "y": 0.094
        },
        {
          "x": 0.683,
          "y": 0.284
        },
        {
          "x": 0.807,
          "y": 0.3
        },
        {
          "x": 0.893,
          "y": 0.262
        },
        {
          "x": 0.842,
          "y": 0.262
        },
        {
          "x": 0.789,
          "y": 0.238
        },
        {
          "x": 0.235,
          "y": 0.458
        },
        {
          "x": 0.198,
          "y": 0.456
        },
        {
          "x": 0.143,
          "y": 0.666
        },
        {
          "x": 0.265,
          "y": 0.624
        },
        {
          "x": 0.464,
          "y": 0.661
        },
        {
          "x": 0.135,
          "y": 0.762
        },
        {
          "x": 0.474,
          "y": 0.847
        },
        {
          "x": 0.436,
          "y": 0.806
        },
        {
          "x": 0.696,
          "y": 0.788
        },
        {
          "x": 0.649,
          "y": 0.859
        },
        {
          "x": 0.787,
          "y": 0.85
        }
      ],
      "PORTRAIT_POSITIONS": [
        {
          "x": 0.192,
          "y": 0.219
        },
        {
          "x": 0.315,
          "y": 0.18
        },
        {
          "x": 0.443,
          "y": 0.196
        },
        {
          "x": 0.696,
          "y": 0.3
        },
        {
          "x": 0.869,
          "y": 0.312
        },
        {
          "x": 0.888,
          "y": 0.354
        },
        {
          "x": 0.821,
          "y": 0.352
        },
        {
          "x": 0.336,
          "y": 0.475
        },
        {
          "x": 0.093,
          "y": 0.475
        },
        {
          "x": 0.181,
          "y": 0.445
        },
        {
          "x": 0.184,
          "y": 0.498
        },
        {
          "x": 0.048,
          "y": 0.768
        },
        {
          "x": 0.053,
          "y": 0.708
        },
        {
          "x": 0.224,
          "y": 0.664
        },
        {
          "x": 0.384,
          "y": 0.655
        },
        {
          "x": 0.469,
          "y": 0.688
        },
        {
          "x": 0.448,
          "y": 0.712
        },
        {
          "x": 0.381,
          "y": 0.733
        },
        {
          "x": 0.643,
          "y": 0.904
        },
        {
          "x": 0.589,
          "y": 0.787
        }
      ],
      "LANDSCAPE_POSITIONS": [
        {
          "x": 0.192,
          "y": 0.219
        },
        {
          "x": 0.31,
          "y": 0.366
        },
        {
          "x": 0.437,
          "y": 0.382
        },
        {
          "x": 0.399,
          "y": 0.31
        },
        {
          "x": 0.321,
          "y": 0.517
        },
        {
          "x": 0.321,
          "y": 0.451
        },
        {
          "x": 0.724,
          "y": 0.735
        },
        {
          "x": 0.819,
          "y": 0.729
        },
        {
          "x": 0.884,
          "y": 0.743
        },
        {
          "x": 0.884,
          "y": 0.878
        },
        {
          "x": 0.782,
          "y": 0.918
        },
        {
          "x": 0.72,
          "y": 0.883
        },
        {
          "x": 0.663,
          "y": 0.732
        },
        {
          "x": 0.03,
          "y": 0.944
        },
        {
          "x": 0.096,
          "y": 0.968
        },
        {
          "x": 0.13,
          "y": 0.119
        },
        {
          "x": 0.196,
          "y": 0.077
        },
        {
          "x": 0.952,
          "y": 0.512
        },
        {
          "x": 0.988,
          "y": 0.557
        },
        {
          "x": 0.809,
          "y": 0.263
        }
      ],
      "CHARACTER_ANIMATION": {
        "EXIT_DURATION": 2400,
        "BOUNCE_HEIGHT": 0.1,
        "BOUNCE_DECAY": 0.7,
        "BOUNCE_COUNT": 3,
        "BOUNCE_SOUND": "bounce_sound"
      }
    },
    "MID_CARD": {
      "DURATION": 1000,
      "PARTICLE_CONFIG": {
        "SPEED": 50,
        "MAX_PARTICLES": 100,
        "LIFESPAN": 1000
      }
    },
    "END_CARD": {
      "BUTTON_SCALE_RATIO": 0.001,
      "LOGO_SCALE_RATIO": 0.0015
    }
  },
  "AUDIO": {
    "BG_MUSIC_VOLUME": 0.9
  },
  "WALDO": {
    "IDLE": {
      "HAND": {
        "DEFAULT_ROTATION": - 7 * Math.PI / 8,
        "WAVE": {
          "UP_ROTATION": - Math.PI/6,
          "DURATION": {
            "RAISE": 300,
            "WAVE": 200,
            "LOWER": 400
          },
          "WAVE_COUNT": 2,
          "INTERVAL": {
            "MIN": 2000,
            "MAX": 3000
          }
        }
      },
      "FACE": {
        "BLINK": {
          "FRAMES": ["eye1", "eye2", "eye3"],
          "FRAME_DURATION": 400,
          "INTERVAL": {
            "MIN": 2000,
            "MAX": 4000
          }
        },
        "SPEAK": {
          "FRAMES": ["mouth1", "mouth2", "mouth3", "mouth4"],
          "FRAME_DURATION": 200,
          "INTERVAL": {
            "MIN": 3000,
            "MAX": 5000
          },
          "SOUND": "help_audio"
        }
      }
    },
    "LOSE": {
      "STANDING": {
        "PARTS": ["waldo_standing", "waldo_standing_left_hand", "waldo_standing_right_hand"],
        "FALL_DURATION": 1000,
        "HAND_ROTATION_SPEED": 200
      }
    }
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

// Helper function to get current positions based on orientation
export const getCurrentPositions = (scene) => {
    const gameConfig = GAME_CONFIG.SCENES.GAME;
    
    if (!gameConfig.USE_SEPARATE_POSITIONS) {
        return gameConfig.CHARACTER_POSITIONS;
    }

    return scene.scale.width > scene.scale.height ? 
        gameConfig.LANDSCAPE_POSITIONS : 
        gameConfig.PORTRAIT_POSITIONS;
};