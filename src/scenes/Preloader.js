import * as Phaser from '../phaser/phaser-3.87.0-core.js';

import { Base64Manager } from '../utils/Base64Manager.js';
import { LoadBase64Audio } from '../utils/LoadBase64Audio.js';
// import { LoadBase64BitmapFont } from '../utils/LoadBase64BitmapFont.js';
import { adReady } from '../networkPlugin';

//import { .DSStore } from '../../media/.DS_Store.js';
import { duckClickSoundMP3 } from '../../media/audio_duck_click_sound.mp3.js';
//import { .DSStore } from '../../media/images_.DS_Store.js';
import { Cursor1PNG } from '../../media/images_Cursor_1.png.js';
import { LogoImagePNG } from '../../media/images_Logo_image.png.js';
import { PlayNowPNG } from '../../media/images_PlayNow.png.js';
import { VideoBGPNG } from '../../media/images_VideoBG.png.js';
import { duckColoredPNG } from '../../media/images_duck_colored.png.js';
// import { duckColored1PNG } from '../../media/images_duck_colored1.png.js';
import { duckOutlinePNG } from '../../media/images_duck_outline.png.js';
// import { duckOutline1PNG } from '../../media/images_duck_outline1.png.js';
import { map1PNG } from '../../media/images_map1.png.js';
import { map2PNG } from '../../media/images_map2.png.js';
import { map3PNG } from '../../media/images_map3.png.js';
// import { mapOutlinedHQPNG } from '../../media/images_map_outlined_HQ.png.js';
// import { mapOutlinedHQ1PNG } from '../../media/images_map_outlined_HQ1.png.js';
// import { mapOutlinedHQ3PNG } from '../../media/images_map_outlined_HQ3.png.js';
// import { mapWinterWonderland 2WEBP } from '../../media/images_map_winter_wonderland 2.webp.js';
// import { mapWinterWonderlandPNG } from '../../media/images_map_winter_wonderland.png.js';
//import { mapWinterWonderland11zonPNG } from '../../media/images_map_winter_wonderland_11zon.png.js';
import { mapWinterlandResizedPNG } from '../../media/images_map_winterland_resized.png.js';
// import { mapWinterWonderlandWEBP } from '../../media/images_map_winter_wonderland.webp.js';
// import { mapWinterWonderlandZIP } from '../../media/images_map_winter_wonderland.zip.js';
// import { pixelBluePNG } from '../../media/images_pixel_blue.png.js';
// import { pixelGreenPNG } from '../../media/images_pixel_green.png.js';
// import { pixelRedPNG } from '../../media/images_pixel_red.png.js';
// import { pixelWhitePNG } from '../../media/images_pixel_white.png.js';
// import { pixelYellowPNG } from '../../media/images_pixel_yellow.png.js';
// import { christmasClassicLand11zonPNG } from '../../media/images_christmas_classic_land_11zon.png.js';
import { playbtnPNG } from '../../media/images_playbtn.png.js';
import { polarBearColoredPNG } from '../../media/images_polar_bear_colored.png.js';
// import { polarBearOutlinedPNG } from '../../media/images_polar_bear_outlined.png.js';
// import { polarBearColoredEdgePNG } from '../../media/images_polar_bear_colored_edge.png.js';
import { retrySVG } from '../../media/images_retry.svg.js';
import { starPNG } from '../../media/images_star.png.js';
import { pixelJSON } from '../../media/spine_pixel.json.js';
import { pixelPNG } from '../../media/spine_pixel.png.js';
//import { polarBearColoredEdgeDark1PNG } from '../../media/images_polar_bear_colored_edge_dark1.png.js';
//import { brownBearOutlinedFine5PNG } from '../../media/images_brown_bear_outlined_fine_5.png.js';
//import { brownBearOutlinedSmooth4PNG } from '../../media/images_brown_bear_outlined_smooth_4.png.js';
import { brownBearColoredPNG } from '../../media/images_brown_bear_colored.png.js';
import { brownBearOutlinedSmooth2PNG } from '../../media/images_brown_bear_outlined_smooth_2.png.js';
import { brownBearOutlinedSmooth5PNG } from '../../media/images_brown_bear_outlined_smooth_5.png.js';
import { seekEnglishVoiceoverMP3 } from '../../media/audio_seek_english_voiceover.mp3.js';
import { seekRussianVoiceoverMP3 } from '../../media/audio_seek_russian_voiceover.mp3.js';
import { suspenseTheme2MP3 } from '../../media/audio_suspense_theme2.mp3.js';
//import { suspenseTheme1MP3 } from '../../media/audio_suspense_theme1.mp3.js';

//import { suspenseTheme3MP3 } from '../../media/audio_suspense_theme3.mp3.js';

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
            { key: 'duck_click_sound', data: duckClickSoundMP3 },
            { key: 'seek_english_voiceover', data: seekEnglishVoiceoverMP3 },
            { key: 'seek_russian_voiceover', data: seekRussianVoiceoverMP3 },
            { key: 'suspense_theme', data: suspenseTheme2MP3 }
        ]);
    
        
        this.load.image('map_outlined_HQ', mapWinterlandResizedPNG);
        this.load.image('duck_colored', brownBearColoredPNG);
        this.load.image('duck_outline', brownBearOutlinedSmooth5PNG);
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
        this.load.image("retryIcon", retrySVG);
    }

    create ()
    {
        //  This may run before the Loader has completed, so don't use in-flight assets here
    }

    base64LoaderComplete ()
    {
        adReady();

        this.scene.start('StartCard');
    }
}
