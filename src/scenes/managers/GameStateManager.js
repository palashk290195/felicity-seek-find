export const GameState = {
    TUTORIAL: 'TUTORIAL',
    PLAYING: 'PLAYING',
    WIN: 'WIN',
    LOSE: 'LOSE'
};

export class GameStateManager {
    constructor(scene) {
        this.scene = scene;
        this.currentState = GameState.TUTORIAL;
        this.stateChangeCallbacks = new Map();
    }

    getCurrentState() {
        return this.currentState;
    }

    onStateChange(state, callback) {
        if (!this.stateChangeCallbacks.has(state)) {
            this.stateChangeCallbacks.set(state, []);
        }
        this.stateChangeCallbacks.get(state).push(callback);
    }

    setState(newState) {
        const oldState = this.currentState;
        this.currentState = newState;
        
        // Execute callbacks for this state change
        const callbacks = this.stateChangeCallbacks.get(newState) || [];
        callbacks.forEach(callback => callback(oldState));
        
        console.log(`[GameStateManager] State changed from ${oldState} to ${newState}`);
    }
} 