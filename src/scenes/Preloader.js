import * as Phaser from '../phaser/phaser-3.87.0-core.js';

import { Base64Manager } from '../utils/Base64Manager.js';
import { LoadBase64Audio } from '../utils/LoadBase64Audio.js';
import { adReady } from '../networkPlugin';


import { bgJPEG } from '../../media/images_bright-cat_bg.jpeg.js';
import { brightOverlayPNG } from '../../media/images_bright-cat_bright-overlay.png.js';
import { cat1HighlightPNG } from '../../media/images_bright-cat_cat-1-highlight.png.js';
import { cat1PNG } from '../../media/images_bright-cat_cat-1.png.js';
import { cat2HighlightPNG } from '../../media/images_bright-cat_cat-2-highlight.png.js';
import { cat2PNG } from '../../media/images_bright-cat_cat-2.png.js';
import { cat3HighlightPNG } from '../../media/images_bright-cat_cat-3-highlight.png.js';
import { cat3PNG } from '../../media/images_bright-cat_cat-3.png.js';
import { cat4HighlightPNG } from '../../media/images_bright-cat_cat-4-highlight.png.js';
import { cat4PNG } from '../../media/images_bright-cat_cat-4.png.js';
import { cat5HighlightPNG } from '../../media/images_bright-cat_cat-5-highlight.png.js';
import { cat5PNG } from '../../media/images_bright-cat_cat-5.png.js';
import { downloadIconPNG } from '../../media/images_bright-cat_download-icon.png.js';
import { findTextEnglishPNG } from '../../media/images_bright-cat_find-text_find-text-english.png.js';
import { highlightPNG } from '../../media/images_bright-cat_highlight.png.js';

import { LogoImagePNG } from '../../media/images_Logo_image.png.js';
import { iconCatPNG } from '../../media/images_icon_cat.png.js';

import { PlayNowEnPNG } from '../../media/images_PlayNow-en.png.js';
import { PlayNowRuPNG } from '../../media/images_PlayNow-ru.png.js';
import { PlayNowDePNG } from '../../media/images_PlayNow_de.png.js';
import { PlayNowJaPNG } from '../../media/images_PlayNow_ja.png.js';
import { seekEnglishVoiceoverMP3 } from '../../media/audio_seek_english_voiceover.mp3.js';
import { seekGermanVoiceoverMP3 } from '../../media/audio_seek_german_voiceover.mp3.js';
import { seekJapaneseVoiceoverMP3 } from '../../media/audio_seek_japanese_voiceover.mp3.js';
import { seekRussianVoiceoverMP3 } from '../../media/audio_seek_russian_voiceover.mp3.js';



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

        // Load bright cat game assets
        this.load.image('bg', bgJPEG);
        this.load.image('bright-overlay', brightOverlayPNG);
        this.load.image('cat-1-highlight', cat1HighlightPNG);
        this.load.image('cat-1', cat1PNG);
        this.load.image('cat-2-highlight', cat2HighlightPNG);
        this.load.image('cat-2', cat2PNG);
        this.load.image('cat-3-highlight', cat3HighlightPNG);
        this.load.image('cat-3', cat3PNG);
        this.load.image('cat-4-highlight', cat4HighlightPNG);
        this.load.image('cat-4', cat4PNG);
        this.load.image('cat-5-highlight', cat5HighlightPNG);
        this.load.image('cat-5', cat5PNG);
        this.load.image('download', downloadIconPNG);
        this.load.image('find-text', findTextEnglishPNG);
        this.load.image('highlight', highlightPNG);

        LoadBase64Audio(this, [
            { key: 'seek_english_voiceover', data: seekEnglishVoiceoverMP3 },
            { key: 'seek_german_voiceover', data: seekGermanVoiceoverMP3 },
            { key: 'seek_japanese_voiceover', data: seekJapaneseVoiceoverMP3 },
            { key: 'seek_russian_voiceover', data: seekRussianVoiceoverMP3 }
        ]);
    
        
        
        // End screen assets
        this.load.image('seek-find-text', LogoImagePNG);
        this.load.image('logo', iconCatPNG);

        this.load.image('play-now', PlayNowEnPNG);
        this.load.image('playnow_ru', PlayNowRuPNG);
        this.load.image('playnow_de', PlayNowDePNG);
        this.load.image('playnow_ja', PlayNowJaPNG);  
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
