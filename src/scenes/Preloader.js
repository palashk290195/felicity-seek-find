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
import { findTextFrenchPNG } from '../../media/images_bright-cat_find-text_find-text-french.png.js';
import { findTextGermanPNG } from '../../media/images_bright-cat_find-text_find-text-german.png.js';
import { findTextJapanesePNG } from '../../media/images_bright-cat_find-text_find-text-japanese.png.js';
import { findTextKoreanPNG } from '../../media/images_bright-cat_find-text_find-text-korean.png.js';
import { findTextPortuguesePNG } from '../../media/images_bright-cat_find-text_find-text-portuguese.png.js';
import { findTextRussianPNG } from '../../media/images_bright-cat_find-text_find-text-russian.png.js';
import { highlightPNG } from '../../media/images_bright-cat_highlight.png.js';

import { LogoImagePNG } from '../../media/images_Logo_image.png.js';
import { iconCatPNG } from '../../media/images_icon_cat.png.js';

import { PlayMoreDePNG } from '../../media/images_bright-cat_play-more_PlayMore-de.png.js';
import { PlayMoreEnPNG } from '../../media/images_bright-cat_play-more_PlayMore-en.png.js';
import { PlayMoreFrPNG } from '../../media/images_bright-cat_play-more_PlayMore-fr.png.js';
import { PlayMoreJpPNG } from '../../media/images_bright-cat_play-more_PlayMore-jp.png.js';
import { PlayMoreKoPNG } from '../../media/images_bright-cat_play-more_PlayMore-ko.png.js';
import { PlayMorePtPNG } from '../../media/images_bright-cat_play-more_PlayMore-pt.png.js';
import { PlayMoreRuPNG } from '../../media/images_bright-cat_play-more_PlayMore-ru.png.js';

import { seekEnglishVoiceoverMP3 } from '../../media/audio_seek_english_voiceover.mp3.js';
import { seekFrenchVoiceoverMP3 } from '../../media/audio_seek_french_voiceover.mp3.js';
import { seekGermanVoiceoverMP3 } from '../../media/audio_seek_german_voiceover.mp3.js';
import { seekJapaneseVoiceoverMP3 } from '../../media/audio_seek_japanese_voiceover.mp3.js';
import { seekKoreanVoiceoverMP3 } from '../../media/audio_seek_korean_voiceover.mp3.js';
import { seekPortugueseVoiceoverMP3 } from '../../media/audio_seek_portuguese_voiceover.mp3.js';
import { seekRussianVoiceoverMP3 } from '../../media/audio_seek_russian_voiceover.mp3.js';

import { catBgAudioMP3 } from '../../media/audio_cat-bg-audio.mp3.js';
import { catClickMP3 } from '../../media/audio_cat-click.mp3.js';



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
        this.load.image('highlight', highlightPNG);

        // Load language-specific find text images
        this.load.image('find-text-english', findTextEnglishPNG);
        this.load.image('find-text-french', findTextFrenchPNG);
        this.load.image('find-text-german', findTextGermanPNG);
        this.load.image('find-text-japanese', findTextJapanesePNG);
        this.load.image('find-text-korean', findTextKoreanPNG);
        this.load.image('find-text-portuguese', findTextPortuguesePNG);
        this.load.image('find-text-russian', findTextRussianPNG);

        // Load language-specific play more images
        this.load.image('play-more-de', PlayMoreDePNG);
        this.load.image('play-more-en', PlayMoreEnPNG);
        this.load.image('play-more-fr', PlayMoreFrPNG);
        this.load.image('play-more-jp', PlayMoreJpPNG);
        this.load.image('play-more-ko', PlayMoreKoPNG);
        this.load.image('play-more-pt', PlayMorePtPNG);
        this.load.image('play-more-ru', PlayMoreRuPNG);

        // Load all language voiceovers
        LoadBase64Audio(this, [
            { key: 'seek_english_voiceover', data: seekEnglishVoiceoverMP3 },
            { key: 'seek_french_voiceover', data: seekFrenchVoiceoverMP3 },
            { key: 'seek_german_voiceover', data: seekGermanVoiceoverMP3 },
            { key: 'seek_japanese_voiceover', data: seekJapaneseVoiceoverMP3 },
            { key: 'seek_korean_voiceover', data: seekKoreanVoiceoverMP3 },
            { key: 'seek_portuguese_voiceover', data: seekPortugueseVoiceoverMP3 },
            { key: 'seek_russian_voiceover', data: seekRussianVoiceoverMP3 },
            { key: 'cat-bg-audio', data: catBgAudioMP3 },
            { key: 'cat-click', data: catClickMP3 }
        ]);
        
        // End screen assets
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
