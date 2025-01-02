export const AudioUtils = {
    pendingSounds: new Set(),
    hasUserInteracted: false,
    initialized: false,

    setup(scene) {
        scene.sound.mute = false;
        scene.sound.volume = 1;
        console.log('[AudioUtils] Initial sound setup complete');

        // Only set up interaction listeners if not already initialized
        if (!this.initialized) {
            console.log('[AudioUtils] First time setup - adding interaction listeners');
            
            const handleFirstInteraction = () => {
                console.log('[AudioUtils] User interaction detected');
                AudioUtils.hasUserInteracted = true;
                
                AudioUtils.pendingSounds.forEach(({ scene, key, config }) => {
                    console.log(`[AudioUtils] Playing pending sound: ${key}`);
                    scene.sound.play(key, config);
                });
                AudioUtils.pendingSounds.clear();
            };

            const interactionEvents = ['click', 'touchstart', 'keydown', 'pointerdown'];
            interactionEvents.forEach(event => {
                window.addEventListener(event, handleFirstInteraction, { once: true });
                console.log(`[AudioUtils] Listening for first interaction event: ${event}`);
            });

            this.initialized = true;
        }

        // Handle various pause events
        const handlePause = () => {
            console.log('[AudioUtils] App/Device pause detected');
            scene.sound.pauseAll();
        };

        const handleResume = () => {
            console.log('[AudioUtils] App/Device resume detected');
            if (!scene.sound.mute && this.hasUserInteracted) {
                scene.sound.resumeAll();
            }
        };

        // Handle visibility change
        const handleVisibility = () => {
            console.log('[AudioUtils] Document visibility changed:', document.hidden ? 'hidden' : 'visible');
            if (document.hidden) {
                handlePause();
            } else {
                handleResume();
            }
        };

        // Add all event listeners
        document.addEventListener('visibilitychange', handleVisibility);
        window.addEventListener('pagehide', handlePause);
        window.addEventListener('pageshow', handleResume);
        window.addEventListener('freeze', handlePause);
        window.addEventListener('resume', handleResume);
        
        // Mobile-specific events
        document.addEventListener('pause', handlePause, false);
        document.addEventListener('resume', handleResume, false);

        console.log('[AudioUtils] Added all pause/resume event listeners');

        return () => {
            console.log('[AudioUtils] Cleaning up scene audio');
            document.removeEventListener('visibilitychange', handleVisibility);
            window.removeEventListener('pagehide', handlePause);
            window.removeEventListener('pageshow', handleResume);
            window.removeEventListener('freeze', handlePause);
            window.removeEventListener('resume', handleResume);
            document.removeEventListener('pause', handlePause);
            document.removeEventListener('resume', handleResume);
            scene.sound.stopAll();
        };
    },

    playSound(scene, key, config = {}) {
        if (this.hasUserInteracted) {
            console.log(`[AudioUtils] Playing sound: ${key} (user has already interacted)`);
            return scene.sound.play(key, config);
        } else {
            console.log(`[AudioUtils] No user interaction yet, queueing sound: ${key}`);
            this.pendingSounds.add({ scene, key, config });
            return null;
        }
    }
};