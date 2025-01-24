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
// import { duckColoredPNG } from '../../media/images_duck_colored.png.js';
// import { duckColored1PNG } from '../../media/images_duck_colored1.png.js';
// import { duckOutlinePNG } from '../../media/images_duck_outline.png.js';
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
import { SportsCityMapPNG } from '../../media/images_SportsCity_Map.png.js';
// import { mapChristmasLandPNG } from '../../media/images_map_christmas_land.png.js';
// import { mapWinterWonderlandWEBP } from '../../media/images_map_winter_wonderland.webp.js';
// import { mapWinterWonderlandZIP } from '../../media/images_map_winter_wonderland.zip.js';
// import { pixelBluePNG } from '../../media/images_pixel_blue.png.js';
// import { pixelGreenPNG } from '../../media/images_pixel_green.png.js';
// import { pixelRedPNG } from '../../media/images_pixel_red.png.js';
// import { pixelWhitePNG } from '../../media/images_pixel_white.png.js';
// import { pixelYellowPNG } from '../../media/images_pixel_yellow.png.js';
// import { christmasClassicLand11zonPNG } from '../../media/images_christmas_classic_land_11zon.png.js';
import { playbtnPNG } from '../../media/images_playbtn.png.js';
//import { polarBearColoredPNG } from '../../media/images_polar_bear_colored.png.js';
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
// import { brownBearOutlinedSmooth2PNG } from '../../media/images_brown_bear_outlined_smooth_2.png.js';
// import { brownBearOutlineWEBP } from '../../media/images_brown_bear_outline.webp.js';
import { brownBearOutlinedSmooth5PNG } from '../../media/images_brown_bear_outlined_smooth_5.png.js';
// import { suspenseTheme2MP3 } from '../../media/audio_suspense_theme2.mp3.js';
import { rugbyOutlinePNG } from '../../media/images_rugby-outline.png.js';
import { rugbyPNG } from '../../media/images_rugby.png.js';

import { seekBgMusicMP3 } from '../../media/audio_seek_bg_music.mp3.js';
import { playbtnEnPNG } from '../../media/images_playbtn-en.png.js';
import { playbtnRuPNG } from '../../media/images_playbtn-ru.png.js';
import { playbtnDePNG } from '../../media/images_playbtn_de.png.js';
import { playbtnJaPNG } from '../../media/images_playbtn_ja.png.js';
import { PlayNowEnPNG } from '../../media/images_PlayNow-en.png.js';
import { PlayNowRuPNG } from '../../media/images_PlayNow-ru.png.js';
import { PlayNowDePNG } from '../../media/images_PlayNow_de.png.js';
import { PlayNowJaPNG } from '../../media/images_PlayNow_ja.png.js';
import { seekEnglishVoiceoverMP3 } from '../../media/audio_seek_english_voiceover.mp3.js';
import { seekGermanVoiceoverMP3 } from '../../media/audio_seek_german_voiceover.mp3.js';
import { seekJapaneseVoiceoverMP3 } from '../../media/audio_seek_japanese_voiceover.mp3.js';
import { seekRussianVoiceoverMP3 } from '../../media/audio_seek_russian_voiceover.mp3.js';
import { bounceSoundMP3 } from '../../media/audio_bounce_sound.mp3.js';
import { acidRiverPNG } from '../../media/images_waldo_drowning_acid_river.png.js';
import { acidRiverNewPNG } from '../../media/images_waldo_drowning_acid_river_new.png.js';
import { acidStreamPNG } from '../../media/images_waldo_drowning_acid_stream.png.js';
import { acidWavePNG } from '../../media/images_waldo_drowning_acid_wave.png.js';
import { blackTankPNG } from '../../media/images_waldo_drowning_black_tank.png.js';
import { eye1PNG } from '../../media/images_waldo_drowning_eye1.png.js';
import { eye2PNG } from '../../media/images_waldo_drowning_eye2.png.js';
import { eye3PNG } from '../../media/images_waldo_drowning_eye3.png.js';
import { handPNG } from '../../media/images_waldo_drowning_hand.png.js';
import { heartBgPNG } from '../../media/images_waldo_drowning_heart_bg.png.js';
import { heartMaskPNG } from '../../media/images_waldo_drowning_heart_mask.png.js';
import { mouth1PNG } from '../../media/images_waldo_drowning_mouth1.png.js';
import { mouth2PNG } from '../../media/images_waldo_drowning_mouth2.png.js';
import { mouth3PNG } from '../../media/images_waldo_drowning_mouth3.png.js';
import { mouth4PNG } from '../../media/images_waldo_drowning_mouth4.png.js';
import { objectBenchPNG } from '../../media/images_waldo_drowning_object_bench.png.js';
import { streamMaskBlackPNG } from '../../media/images_waldo_drowning_stream_mask_black.png.js';
import { streamMaskWhitePNG } from '../../media/images_waldo_drowning_stream_mask_white.png.js';
//import { videoPNG } from '../../media/images_waldo_drowning_video.png.js';
import { waldoBenchPNG } from '../../media/images_waldo_drowning_waldo_bench.png.js';
import { waldoSeatingBodyPNG } from '../../media/images_waldo_drowning_waldo_seating_body.png.js';
import { waldoSeatingRightHandPNG } from '../../media/images_waldo_drowning_waldo_seating_right_hand.png.js';
import { waldoStandingPNG } from '../../media/images_waldo_drowning_waldo_standing.png.js';
import { waldoStandingLeftHandPNG } from '../../media/images_waldo_drowning_waldo_standing_left_hand.png.js';
import { waldoStandingRightHandPNG } from '../../media/images_waldo_drowning_waldo_standing_right_hand.png.js';
import { wallStairsPNG } from '../../media/images_waldo_drowning_wall_stairs.png.js';
import MapVideoWEBM from '../../public/assets/videos/MapVideo.webm';

import { AcidFlowingMP3 } from '../../media/audio_waldo_audio_AcidFlowing.mp3.js';
import { AcidHoleMP3 } from '../../media/audio_waldo_audio_AcidHole.mp3.js';
import { helpMP3 } from '../../media/audio_waldo_audio_help.mp3.js';
import { playerFallMP3 } from '../../media/audio_waldo_audio_playerFall.mp3.js';
import { playerFallBGMP3 } from '../../media/audio_waldo_audio_playerFallBG.mp3.js';
import { userTapMP3 } from '../../media/audio_waldo_audio_userTap.mp3.js';
import { woodBlockFlyingMP3 } from '../../media/audio_waldo_audio_woodBlockFlying.mp3.js';




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
            { key: 'seek_german_voiceover', data: seekGermanVoiceoverMP3 },
            { key: 'seek_japanese_voiceover', data: seekJapaneseVoiceoverMP3 },
            { key: 'seek_russian_voiceover', data: seekRussianVoiceoverMP3 },
            { key: 'seek_bg_music', data: seekBgMusicMP3 },
            {key: 'bounce_sound', data: bounceSoundMP3},
            {key: 'help_audio', data: helpMP3}
        ]);
    
        
        this.load.image('map_outlined_HQ', SportsCityMapPNG);
        this.load.image('duck_colored', rugbyPNG);
        this.load.image('duck_outline', rugbyOutlinePNG);
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

        this.load.image('playbtn_en', playbtnEnPNG);
        this.load.image('playbtn_ru', playbtnRuPNG);
        this.load.image('playbtn_de', playbtnDePNG);
        this.load.image('playbtn_ja', playbtnJaPNG);
        this.load.image('playnow_en', PlayNowEnPNG);
        this.load.image('playnow_ru', PlayNowRuPNG);
        this.load.image('playnow_de', PlayNowDePNG);
        this.load.image('playnow_ja', PlayNowJaPNG);

        // Load Waldo drowning animation assets
        this.load.video('video', MapVideoWEBM, 'loadeddata', true);
        this.load.image('object_bench', objectBenchPNG);
        this.load.image('heart_bg', heartBgPNG);
        this.load.image('waldo_bench', waldoBenchPNG);
        this.load.image('heart_mask', heartMaskPNG);
        this.load.image('waldo_seating_body', waldoSeatingBodyPNG);
        this.load.image('waldo_seating_right_hand', waldoSeatingRightHandPNG);
        this.load.image('mouth1', mouth1PNG);
        this.load.image('mouth2', mouth2PNG);
        this.load.image('mouth3', mouth3PNG);
        this.load.image('mouth4', mouth4PNG);
        this.load.image('eye1', eye1PNG);
        this.load.image('eye2', eye2PNG);
        this.load.image('eye3', eye3PNG);
        this.load.image('waldo_standing', waldoStandingPNG);
        this.load.image('waldo_standing_right_hand', waldoStandingRightHandPNG);
        this.load.image('waldo_standing_left_hand', waldoStandingLeftHandPNG);
        this.load.image('acid_stream', acidStreamPNG);
        this.load.image('stream_mask_white', streamMaskWhitePNG);
        this.load.image('stream_mask_black', streamMaskBlackPNG);
        this.load.image('stream_mask_white_2', streamMaskWhitePNG);
        this.load.image('stream_mask_black_2', streamMaskBlackPNG);
        this.load.image('acid_river', acidRiverNewPNG);
        this.load.image('acid_wave', acidWavePNG);
        this.load.image('black_tank', blackTankPNG);
        this.load.image('wall_stairs', wallStairsPNG);
        this.load.image('hand', handPNG);
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
