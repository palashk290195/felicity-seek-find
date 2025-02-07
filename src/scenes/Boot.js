import * as Phaser from '../phaser/phaser-3.87.0-core.js';
import snfFont from '../../public/assets/fonts/snf-font.woff2';

export class Boot extends Phaser.Scene {
    constructor() {
        super('Boot');
        this.fontLoaded = false;
        this.assetsLoaded = false;
        this.hasStartedTransition = false;
    }

    init() {
        console.log('Boot Scene: init started');
        // Add font to document before anything else
        const style = document.createElement('style');
        style.textContent = `
            @font-face {
                font-family: 'snf-font';
                src: url('${snfFont}') format('woff2');
                font-weight: normal;
                font-style: normal;
            }
        `;
        document.head.appendChild(style);
        
        // Start font loading
        this.loadCustomFont();
        console.log('Boot Scene: init completed');
    }

    preload() {

        
        console.log('Boot Scene: preload started');
        // Create loading bar container
        
        // Add loading text
        const loadingText = this.add.text(this.scale.width / 2, this.scale.height / 2, 'Loading...', {
            font: '20px Arial',
            fill: '#ffffff'
        });
        loadingText.setOrigin(0.5, 0.5);
        

        // Create loading text with system font
        const testText = this.add.text(
            -1000,
            -1000,
            'Test',
            { fontFamily: 'snf-font', fontSize: '12px' }
        );

        this.load.on('complete', () => {
            console.log('Boot Scene: All assets loaded');
            this.assetsLoaded = true;
            this.checkProgress();
        });

        console.log('Boot Scene: preload completed');
    }

    create() {
        console.log('Boot Scene: create started');
        this.checkProgress();
    }

    loadCustomFont() {
        console.log('Boot Scene: Starting font load');
        const fontFace = new FontFace('snf-font', `url(${snfFont})`);
        
        fontFace.load()
            .then((loaded) => {
                console.log('Boot Scene: FontFace loaded');
                document.fonts.add(loaded);
                return document.fonts.ready;
            })
            .then(() => {
                console.log('Boot Scene: document.fonts.ready resolved');
                this.verifyFontLoaded();
            })
            .catch((error) => {
                console.error('Boot Scene: Font loading failed:', error);
            });
    }

    verifyFontLoaded() {
        console.log('Boot Scene: Starting font verification');
        const checkFont = () => {
            // More robust font check
            const isLoaded = document.fonts.check('20px snf-font');
            console.log('Boot Scene: Font check result:', isLoaded);

            if (isLoaded) {
                console.log('Boot Scene: Font verified successfully');
                this.fontLoaded = true;
                this.checkProgress();
            } else {
                setTimeout(checkFont, 100);
            }
        };
        
        checkFont();
    }

    checkProgress() {
        console.log('Boot Scene: Checking progress - Font:', this.fontLoaded, 'Assets:', this.assetsLoaded);
        
        // Only proceed if we haven't started transition, both font and assets are ready
        if (!this.hasStartedTransition && this.fontLoaded && this.assetsLoaded) {
            console.log('Boot Scene: All conditions met, starting transition');
            this.hasStartedTransition = true;
            this.scene.start('Preload');
        } else {
            console.log('Boot Scene: Waiting for conditions - hasStartedTransition:', 
                this.hasStartedTransition, 
                'fontLoaded:', this.fontLoaded, 
                'assetsLoaded:', this.assetsLoaded
            );
        }
    }
}
