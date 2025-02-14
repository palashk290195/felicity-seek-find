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

// Import playable-8-sherlock assets
import { bgJPEG } from '../../media/images_playable-8-sherlock_bg.jpeg.js';
import { chairPNG } from '../../media/images_playable-8-sherlock_chair.png.js';
import { completeLoaderPNG } from '../../media/images_playable-8-sherlock_complete-loader.png.js';
import { ctaPNG } from '../../media/images_playable-8-sherlock_cta.png.js';
import { dimBgJPEG } from '../../media/images_playable-8-sherlock_dim-bg.jpeg.js';
import { endBgJPEG } from '../../media/images_playable-8-sherlock_end-bg.jpeg.js';
import { findKey1PNG } from '../../media/images_playable-8-sherlock_find-key-1.png.js';
import { findKey2PNG } from '../../media/images_playable-8-sherlock_find-key-2.png.js';
import { findKey3PNG } from '../../media/images_playable-8-sherlock_find-key-3.png.js';
import { findKey4PNG } from '../../media/images_playable-8-sherlock_find-key-4.png.js';
import { incompleteLoaderPNG } from '../../media/images_playable-8-sherlock_incomplete-loader.png.js';
import { lockPNG } from '../../media/images_playable-8-sherlock_lock.png.js';
import { pointerPNG } from '../../media/images_playable-8-sherlock_pointer.png.js';
import { shelfPNG } from '../../media/images_playable-8-sherlock_shelf.png.js';
import { sherlockPNG } from '../../media/images_playable-8-sherlock_sherlock.png.js';
import { showFindPNG } from '../../media/images_playable-8-sherlock_show-find.png.js';
import { showFoundPNG } from '../../media/images_playable-8-sherlock_show-found.png.js';

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
    
        // Load start card assets
        this.load.image('dim-bg', dimBgJPEG);
        this.load.image('incomplete-loader', incompleteLoaderPNG);
        this.load.image('complete-loader', completeLoaderPNG);
        
        // Load game assets
        this.load.image('bg', bgJPEG);
        this.load.image('lock', lockPNG);
        this.load.image('shelf', shelfPNG);
        this.load.image('pointer', pointerPNG);
        this.load.image('cta', ctaPNG);
        this.load.image('show-find', showFindPNG);
        this.load.image('show-found', showFoundPNG);
        
        // Load find keys
        this.load.image('find-key-1', findKey1PNG);
        this.load.image('find-key-2', findKey2PNG);
        this.load.image('find-key-3', findKey3PNG);
        this.load.image('find-key-4', findKey4PNG);
        
        // Load end card assets
        this.load.image('end-bg', endBgJPEG);
        this.load.image('chair', chairPNG);
        this.load.image('sherlock', sherlockPNG);
        
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

        this.scene.start('StartCard');
    }
}
