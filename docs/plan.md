## Overall Objective
Create an engaging hidden object game where players need to find 6 objects in a horror-themed scene. The game features a dynamic hint system that guides players by animating a circle around unclicked objects. Each object discovery triggers unique visual effects (like lightning, hand movements, etc.) that persist appropriately through screen resizes. Wrong clicks trigger temporary effects (cross display, screen shake) to provide feedback. After finding all objects, a win state shows the BG-Rabbit falling from top with appropriate animations. The game maintains state across layout changes and handles all effects and animations smoothly in both portrait and landscape modes.

## Implementation Plan

### 1. Object Click System & State (Priority 1) ✅
- **Basic Setup**
  - [x] Make all find-objects interactive in `ObjectInteractionManager`
  - [x] Implement basic object destruction on click
  - [x] Create `clickedObjects` Set in `GameStateManager`
  - [x] Add methods: `isObjectClicked`, `markObjectClicked`, `isAllObjectsFound`

- **Effect Framework Foundation**
  - [x] Create base `EffectHandler` class with `isPersistent` property
  - [x] Setup basic effect registration system
  - [x] Add placeholder trigger points in click handler
  - [x] Implement resize handling foundation

- **Count Management**
  - [x] Add counter text configuration to `game-config.js`
  - [ ] Create basic count display
  - [x] Update count on successful clicks
  - [ ] Handle count text positioning

### 2. Win State & BG-Rabbit (Priority 2) ✅
- **Win Detection**
  - [x] Add win state check in `GameStateManager`
  - [x] Create transition to win state
  - [x] Show BG-Rabbit with fall animation
  - [x] Handle win state persistence on resize

- **Animation & Interaction**
  - [x] Calculate off-screen start position for BG-Rabbit
  - [x] Create tween for falling animation with bounce
  - [x] Make BG-Rabbit interactive for CTA
  - [x] Ensure correct positioning after resize

### 3. Hint Manager (Priority 3) ✅
- **Core Implementation**
  - [x] Create `HintManager` class with scene and layout manager references
  - [x] Add `hint-circle` to layout config with appropriate size/position
  - [x] Implement `moveToNextObject()` to calculate position based on unclicked objects
  - [x] Create continuous tween animation (scale 1 -> 1.2 -> 1)

- **State Management**
  - [x] Track current hinted object index
  - [x] Maintain list of unclicked objects
  - [x] Add methods to pause/resume hint animation
  - [x] Handle resize by recalculating position relative to current target

### 4. Cross Manager (Priority 4)
- **Wrong Click Handling**
  - [x] Create `WrongClickManager` class
  - [x] Add cross image to scene with initial invisible state
  - [x] Implement `showCrossAt(x, y)` with fade in/out
  - [x] Add screen shake effect on container
  - [x] Fix wrong click area not updating on resize (container's interactive area needs to match new game dimensions)

- **Animation Control**
  - [x] Set 1-second duration for cross display
  - [x] Handle multiple wrong clicks (queue or cancel previous)
  - [x] Pause hint circle during cross animation
  - [x] Ensure cross positions correctly on resize

### 5. Effect Implementation (Priority 5)
Each effect should implement:
```javascript
class BaseEffect {
    constructor(scene, isPersistent) {
        this.scene = scene;
        this.isPersistent = isPersistent;
    }
    trigger() {}
    cleanup() {}
    handleResize() {}
}
```

1. **Lightning Effect**
   - [ ] Create flash animation
   - [ ] Add fade in/out
   - [ ] Set as non-persistent
   - [ ] Handle cleanup

2. **Hands Effect**
   - [ ] Implement rise animation from bottom
   - [ ] Show hand-shadow and palm-shadow
   - [ ] Set as persistent
   - [ ] Maintain position on resize

3. **Orange Light Effect**
   - [ ] Setup light layers
   - [ ] Add glow animation
   - [ ] Set as persistent/non-persistent based on type
   - [ ] Handle position updates

4. **Lamp Highlight**
   - [ ] Create highlight animation
   - [ ] Add pulsing effect
   - [ ] Set as persistent
   - [ ] Update position on resize

5. **Spider Effect**
   - [x] Show thread first
   - [x] Animate spider down thread
   - [x] Set as persistent
   - [x] Handle thread and spider positioning

6. **Horror Character**
   - [ ] Implement fade in
   - [ ] Add subtle movement
   - [ ] Set as persistent
   - [ ] Maintain position relative to scene

### 6. Code Cleanup & Setup
- **Remove Key-Finding Logic**
  - [ ] Remove `keys` array and related methods from `ObjectInteractionManager`
  - [ ] Update `GameStateManager` to track objects instead of keys
  - [ ] Clean up key-specific animations and transitions

### 7. Resize Handler System
- **Layout State Manager**
  - [ ] Create system to track effect states
  - [ ] Implement state restoration on resize
  - [ ] Handle animation interruption/resumption

- **Effect Position Recalculation**
  - [ ] Update all active effect positions
  - [ ] Maintain relative positioning
  - [ ] Handle orientation changes

### 8. Integration & Testing
- **Component Integration**
  - [ ] Connect all managers to main game loop
  - [ ] Implement event system between managers
  - [ ] Handle state synchronization

- **State Management**
  - [ ] Implement complete state tracking
  - [ ] Handle game phase transitions
  - [ ] Manage effect persistence
