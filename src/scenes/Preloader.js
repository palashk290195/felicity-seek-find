import * as Phaser from '../phaser/phaser-3.87.0-core.js';

import { Base64Manager } from '../utils/Base64Manager.js';
import { LoadBase64Audio } from '../utils/LoadBase64Audio.js';
// import { LoadBase64BitmapFont } from '../utils/LoadBase64BitmapFont.js';
import { adReady } from '../networkPlugin';

// import { .DSStore } from '../../media/.DS_Store.js';
import { duckClickSoundMP3 } from '../../media/audio_duck_click_sound.mp3.js';
// import { .DSStore } from '../../media/images_.DS_Store.js';
import { Cursor1PNG } from '../../media/images_Cursor_1.png.js';
import { LogoImagePNG } from '../../media/images_Logo_image.png.js';
import { PlayNowPNG } from '../../media/images_PlayNow.png.js';
import { VideoBGPNG } from '../../media/images_VideoBG.png.js';
import { duckColoredPNG } from '../../media/images_duck_colored.png.js';
import { duckColored1PNG } from '../../media/images_duck_colored1.png.js';
import { duckOutlinePNG } from '../../media/images_duck_outline.png.js';
import { duckOutline1PNG } from '../../media/images_duck_outline1.png.js';
import { map1PNG } from '../../media/images_map1.png.js';
import { map2PNG } from '../../media/images_map2.png.js';
import { map3PNG } from '../../media/images_map3.png.js';
import { mapOutlinedHQPNG } from '../../media/images_map_outlined_HQ.png.js';
import { mapOutlinedHQ1PNG } from '../../media/images_map_outlined_HQ1.png.js';
import { mapOutlinedHQ3PNG } from '../../media/images_map_outlined_HQ3.png.js';
import { pixelBluePNG } from '../../media/images_pixel_blue.png.js';
import { pixelGreenPNG } from '../../media/images_pixel_green.png.js';
import { pixelRedPNG } from '../../media/images_pixel_red.png.js';
import { pixelWhitePNG } from '../../media/images_pixel_white.png.js';
import { pixelYellowPNG } from '../../media/images_pixel_yellow.png.js';
import { playbtnPNG } from '../../media/images_playbtn.png.js';
import { starPNG } from '../../media/images_star.png.js';
import { pixelJSON } from '../../media/spine_pixel.json.js';
import { pixelPNG } from '../../media/spine_pixel.png.js';

export class Preloader extends Phaser.Scene
{
    constructor () 
    {
        super('Preload');
    }

    init ()
    {
        console.log('%cSCENE::Preloader', 'color: #fff; background: #f00;')
    }

    preload ()
    {
        //  Invoke the Base64Manager - pass in the current scene reference and a callback to invoke when it's done
        Base64Manager(this, () => this.base64LoaderComplete());

        // this.add.text(this.scale.width / 2, this.scale.height / 2, 'Loading...', { fontFamily: 'Arial', fontSize: 64, color: '#ffffff' }).setOrigin(0.5);

        LoadBase64Audio(this, [
            { key: 'duck_click_sound', data: duckClickSoundMP3 }
        ]);
    
        this.load.image('map_outlined_HQ', mapOutlinedHQPNG);
        this.load.image('duck_colored', duckColoredPNG);
        this.load.image('duck_outline', duckOutlinePNG);
        this.load.image('Logo_image', LogoImagePNG);
        this.load.image('map1', map1PNG);
        this.load.image('map2', map2PNG);
        this.load.image('map3', map3PNG);
        this.load.image('playbtn', playbtnPNG);
        this.load.image('PlayNow', PlayNowPNG);
        this.load.image('VideoBG', VideoBGPNG);
        this.load.image('Cursor_1', Cursor1PNG);
        this.load.image('star', starPNG);
        this.load.atlas('pixel', pixelPNG, pixelJSON);
    }

    create ()
    {
        //  This may run before the Loader has completed, so don't use in-flight assets here
    }

    base64LoaderComplete ()
    {
        adReady();

        this.scene.start('Game');
    }
}
