import * as Phaser from '../phaser/phaser-3.87.0-core.js';

import { Base64Manager } from '../utils/Base64Manager.js';
import { LoadBase64Audio } from '../utils/LoadBase64Audio.js';
import { adReady } from '../networkPlugin';

// Import all required assets
import { LogoImagePNG } from '../../media/images_Logo_image.png.js';
import { iconCatPNG } from '../../media/images_icon_cat.png.js';
import { seekEnglishVoiceoverMP3 } from '../../media/audio_seek_english_voiceover.mp3.js';
import { seekGermanVoiceoverMP3 } from '../../media/audio_seek_german_voiceover.mp3.js';
import { seekJapaneseVoiceoverMP3 } from '../../media/audio_seek_japanese_voiceover.mp3.js';
import { seekRussianVoiceoverMP3 } from '../../media/audio_seek_russian_voiceover.mp3.js';

// Import playable-9-sherlock assets
import { bgBrightJPEG } from '../../media/images_playable9-bras_bg-bright.jpeg.js';
import { bgDarkJPEG } from '../../media/images_playable9-bras_bg-dark.jpeg.js';
import { bgRabbitJPEG } from '../../media/images_playable9-bras_bg-rabbit.jpeg.js';
import { bloodPNG } from '../../media/images_playable9-bras_blood.png.js';
import { bra1PNG } from '../../media/images_playable9-bras_bra1.png.js';
import { bra2PNG } from '../../media/images_playable9-bras_bra2.png.js';
import { bra3PNG } from '../../media/images_playable9-bras_bra3.png.js';
import { bra4PNG } from '../../media/images_playable9-bras_bra4.png.js';
import { bra5PNG } from '../../media/images_playable9-bras_bra5.png.js';
import { bra6PNG } from '../../media/images_playable9-bras_bra6.png.js';
import { candlePNG } from '../../media/images_playable9-bras_candle.png.js';
import { crossPNG } from '../../media/images_playable9-bras_cross.png.js';
import { handShadowPNG } from '../../media/images_playable9-bras_hand-shadow.png.js';
import { handPNG } from '../../media/images_playable9-bras_hand.png.js';
import { hintCirclePNG } from '../../media/images_playable9-bras_hint-circle.png.js';
import { horrorCharacterPNG } from '../../media/images_playable9-bras_horror-character.png.js';
import { lampHighlightPNG } from '../../media/images_playable9-bras_lamp-highlight.png.js';
import { leftPalmPNG } from '../../media/images_playable9-bras_left-palm.png.js';
import { lightningPNG } from '../../media/images_playable9-bras_lightning.png.js';
import { orangeBalls1PNG } from '../../media/images_playable9-bras_orange-balls1.png.js';
import { orangeBalls2PNG } from '../../media/images_playable9-bras_orange-balls2.png.js';
import { orangeLightPNG } from '../../media/images_playable9-bras_orange-light.png.js';
import { orangeLight2PNG } from '../../media/images_playable9-bras_orange-light2.png.js';
import { palmShadowPNG } from '../../media/images_playable9-bras_palm-shadow.png.js';
import { rightPalmPNG } from '../../media/images_playable9-bras_right-palm.png.js';
import { spiderThreadPNG } from '../../media/images_playable9-bras_spider-thread.png.js';
import { spiderPNG } from '../../media/images_playable9-bras_spider.png.js';
import { textBgPNG } from '../../media/images_playable9-bras_text-bg.png.js';
import { windowMaskPNG } from '../../media/images_playable9-bras_window-mask.png.js';

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

        LoadBase64Audio(this, [
            { key: 'seek_english_voiceover', data: seekEnglishVoiceoverMP3 },
            { key: 'seek_german_voiceover', data: seekGermanVoiceoverMP3 },
            { key: 'seek_japanese_voiceover', data: seekJapaneseVoiceoverMP3 },
            { key: 'seek_russian_voiceover', data: seekRussianVoiceoverMP3 }
        ]);

        // Load all game assets
        this.load.image('bg-bright', bgBrightJPEG);
        this.load.image('bg-dark', bgDarkJPEG);
        this.load.image('bg-rabbit', bgRabbitJPEG);
        
        // Load find objects (bras)
        this.load.image('find-object1', bra1PNG);
        this.load.image('find-object2', bra2PNG);
        this.load.image('find-object3', bra3PNG);
        this.load.image('find-object4', bra4PNG);
        this.load.image('find-object5', bra5PNG);
        this.load.image('find-object6', bra6PNG);

        // Load hand and palm assets
        this.load.image('hand-shadow', handShadowPNG);
        this.load.image('palm-shadow', palmShadowPNG);
        this.load.image('hand', handPNG);
        this.load.image('right-palm', rightPalmPNG);
        this.load.image('left-palm', leftPalmPNG);

        // Load spider assets
        this.load.image('spider-thread', spiderThreadPNG);
        this.load.image('spider', spiderPNG);

        // Load lighting and effects
        this.load.image('lamp-highlight', lampHighlightPNG);
        this.load.image('orange-lightballs1', orangeBalls1PNG);
        this.load.image('orange-lightballs2', orangeBalls2PNG);
        this.load.image('orange-light', orangeLightPNG);
        this.load.image('orange-light2', orangeLight2PNG);
        this.load.image('lightning', lightningPNG);

        // Load other game assets
        this.load.image('horror-character', horrorCharacterPNG);
        this.load.image('blood', bloodPNG);
        this.load.image('candle', candlePNG);
        this.load.image('cross', crossPNG);
        this.load.image('hint-circle', hintCirclePNG);
        this.load.image('window-mask', windowMaskPNG);
        this.load.image('text-bg', textBgPNG);
        
        // Common assets
        this.load.image('seek-find-text', LogoImagePNG);
        this.load.image('logo', iconCatPNG);
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
