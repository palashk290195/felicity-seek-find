import * as Phaser from './phaser/phaser-3.87.0-core.js';

import { mraidAdNetworks, networkPlugin } from './networkPlugin.js';

import { Game } from './scenes/Game';
import { Preloader } from './scenes/Preloader';
import { config } from './config.js';
import { EndCard } from "./scenes/EndCard";
import { MidCard } from "./scenes/MidCard";
import { StartCard } from './scenes/StartCard';

const gameConfig = {
    type: Phaser.AUTO,
    parent: 'ad-container',
    backgroundColor: "#028af8",
    audio: {
        disableWebAudio: false
    },
    scale: {
        mode: Phaser.Scale.FIT,
        width: window.innerWidth,
        height: window.innerHeight,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [Preloader, StartCard, Game, MidCard, EndCard],
};

function initializePhaserGame ()
{
    return new Phaser.Game(gameConfig);
}
  
function setupGameInitialization (adNetworkType)
{
    const game = initializePhaserGame();

    if (mraidAdNetworks.has(adNetworkType))
    {
        networkPlugin.initMraid(() => game);
    }
    else
    {
        // vungle, google ads, facebook, ironsource, tiktok
        return game;
    }
}
  
setupGameInitialization(config.adNetworkType);
