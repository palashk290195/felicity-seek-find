export class EffectManager {
    constructor(scene) {
        this.scene = scene;
        this.effects = new Map(); // Map of effect name to EffectHandler instance
        this.activeEffects = new Set(); // Track active persistent effects
    }

    registerEffect(name, effectHandler) {
        console.log(`Registering effect: ${name}`);
        this.effects.set(name, effectHandler);
    }

    triggerEffect(name, x, y) {
        console.log(`Attempting to trigger effect: ${name}`);
        const effect = this.effects.get(name);
        if (!effect) {
            console.warn(`Effect ${name} not found`);
            return;
        }

        console.log(`Found effect ${name}, triggering...`);
        effect.trigger(x, y);
        if (effect.isPersistent) {
            this.activeEffects.add(name);
        }
    }

    cleanup() {
        // Cleanup all effects
        this.effects.forEach(effect => effect.cleanup());
        this.activeEffects.clear();
    }

    handleResize() {
        console.log('EffectManager: Handling resize. Active effects:', Array.from(this.activeEffects));
        // Only reposition active persistent effects
        this.activeEffects.forEach(name => {
            console.log(`EffectManager: Resizing effect ${name}`);
            const effect = this.effects.get(name);
            if (effect && effect.isPersistent) {
                effect.handleResize();
            }
        });
    }
} 