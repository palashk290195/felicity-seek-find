# Cursor Effect Implementation Rules

## Effect Structure
1. Each effect should extend `EffectHandler` base class
2. Must implement:
   - `constructor(scene)` - Set persistence flag
   - `trigger()` - Initial effect setup and animation
   - `handleResize()` - Handle resize updates
   - `cleanup()` - Clean state and stop animations

## State Management
1. Track active state with `isActive` flag
2. For persistent effects:
   - Track completion state (e.g., `initialAnimationComplete`)
   - Store references to game objects (but re-fetch on resize)
   - Maintain animation tweens

## Animation Rules
1. Initial animations:
   - Set initial state (position, alpha, etc.)
   - Create one-time animations
   - Mark completion for persistent effects

2. Persistent animations (e.g., pendulum):
   - Clear existing tweens before creating new ones
   - Reset object properties (e.g., angle) before new tweens
   - Use repeat: -1 for continuous animations

## Resize Handling
1. Never listen to resize events directly
2. All resize handling flows through:
   ```
   main.js (resize listener) 
   -> Game.handleResize() 
   -> manager.handleResize() 
   -> effect.handleResize()
   ```

3. In handleResize:
   - Re-fetch objects (they might be recreated)
   - Reset visual properties
   - Restart persistent animations

## When to Use
1. Use for object-specific effects that:
   - Need to animate on trigger
   - Need to persist after initial animation
   - Need to maintain state across resizes

2. Don't use for:
   - One-time animations (use scene tweens)
   - Global UI effects (use managers)
   - Static visual changes

## Configuration
1. Add effect-specific config to `game-config.js`:
   ```javascript
   animation: {
     effectName: {
       duration: 1000,
       // other effect-specific parameters
     }
   }
   ```

## Registration
1. Register effects in ObjectInteractionManager:
   ```javascript
   this.effectManager.registerEffect('object-N-effect', new Effect(scene));
   ```

2. Trigger via:
   ```javascript
   effectManager.triggerEffect(`object-${index}-effect`, x, y);
   ``` 