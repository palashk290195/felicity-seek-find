// src/scenes/utils/layout-manager.js
import { ImageFitter } from './image-fitter.js';

export class LayoutManager {
    constructor(scene, layoutConfig) {
        this.scene = scene;
        this.config = layoutConfig;
        this.containers = new Map();
        this.assets = new Map();
        this.nameToId = new Map(); // Map to store name -> id mapping
        this.debugGraphics = null;
        
        this.initializeFromConfig();
    }

    initializeFromConfig() {
        this.createContainersRecursive(this.config.containers);
        this.updateLayout();
    }

    createContainersRecursive(containers, parentContainer = null) {
        Object.entries(containers).forEach(([containerId, containerConfig]) => {
            const container = this.createContainer(containerId, containerConfig, parentContainer);
            console.log("create container recursive ", containerId);
            
            // Create assets for this container
            if (containerConfig.assets) {
                Object.entries(containerConfig.assets).forEach(([assetId, assetConfig]) => {
                    this.createAsset(containerId, assetId, assetConfig);
                });
            }

            // Recursively create child containers
            if (containerConfig.children) {
                this.createContainersRecursive(containerConfig.children, container);
            }
        });
    }

    createContainer(containerId, config, parentContainer) {
        const container = this.scene.add.container(0, 0);
        if (parentContainer) {
            parentContainer.add(container);
        }

        this.containers.set(containerId, {
            container,
            config,
            parentId: parentContainer ? parentContainer.name : null
        });

        // Add reference to scene for easy access
        this.scene[containerId] = container;
        container.name = containerId;
        console.log("createContainer ", containerId, config);

        if (this.scene.game.config.debug) {
            this.addDebugVisual(container, 0x00ff00, 0.3);
        }

        return container;
    }

    createAsset(containerId, assetId, config) {
        const containerData = this.containers.get(containerId);
        if (!containerData) return;

        let gameObject;
        if (config.type === 'video') {
            gameObject = this.scene.add.video(0, 0, config.key);
        } else {
            gameObject = this.scene.add.image(0, 0, config.key);
        }

        // Store the initial transform state
        const orientation = this.scene.scale.width > this.scene.scale.height ? 'landscape' : 'portrait';
        const initialTransform = config[orientation];

        // Store both ID and name mappings
        this.assets.set(assetId, {
            gameObject,
            config,
            containerId,
            name: config.name, // Store the name
            // Store last known position and transform for visibility toggling
            lastKnownState: {
                x: 0,
                y: 0,
                scale: { x: 1, y: 1 },
                rotation: initialTransform.rotation,
                transform: initialTransform
            }
        });
        this.nameToId.set(config.name, assetId);
        console.log("createAsset ", config.name);

        // Add reference to scene for easy access - both by ID and name
        this.scene[assetId] = gameObject;
        this.scene[config.name] = gameObject; // Add reference by name as well
        gameObject.name = config.name; // Use name instead of ID for the game object's name

        // Set initial visibility
        gameObject.setVisible(initialTransform.isVisible !== false);

        // Add methods for visibility control
        gameObject.show = () => this.showAsset(config.name);
        gameObject.hide = () => this.hideAsset(config.name);
        gameObject.toggleVisibility = () => this.toggleAssetVisibility(config.name);

        containerData.container.add(gameObject);
    }

    // Add these new methods for visibility control
    showAsset(nameOrId) {
        // Try looking up by name first, then fall back to ID
        const assetId = this.nameToId.get(nameOrId) || nameOrId;
        return this._showAsset(assetId);
    }

    hideAsset(nameOrId) {
        // Try looking up by name first, then fall back to ID
        const assetId = this.nameToId.get(nameOrId) || nameOrId;
        return this._hideAsset(assetId);
    }

    toggleAssetVisibility(nameOrId) {
        // Try looking up by name first, then fall back to ID
        const assetId = this.nameToId.get(nameOrId) || nameOrId;
        return this._toggleAssetVisibility(assetId);
    }

    // Private methods that work with IDs internally
    _showAsset(assetId) {
        const assetData = this.assets.get(assetId);
        if (!assetData) return;

        const { gameObject, lastKnownState } = assetData;
        
        // Update the config to reflect the change
        const orientation = this.scene.scale.width > this.scene.scale.height ? 'landscape' : 'portrait';
        assetData.config[orientation].isVisible = true;

        // Restore last known state
        gameObject.setVisible(true);
        gameObject.setPosition(lastKnownState.x, lastKnownState.y);
        gameObject.setScale(lastKnownState.scale.x, lastKnownState.scale.y);
        gameObject.setRotation(lastKnownState.rotation);

        return gameObject;
    }

    _hideAsset(assetId) {
        const assetData = this.assets.get(assetId);
        if (!assetData) return;

        const { gameObject } = assetData;
        
        // Update the config to reflect the change
        const orientation = this.scene.scale.width > this.scene.scale.height ? 'landscape' : 'portrait';
        assetData.config[orientation].isVisible = false;

        gameObject.setVisible(false);

        return gameObject;
    }

    _toggleAssetVisibility(assetId) {
        const assetData = this.assets.get(assetId);
        if (!assetData) return;

        const { gameObject } = assetData;
        return gameObject.visible ? this._hideAsset(assetId) : this._showAsset(assetId);
    }

    updateAssetTransform(assetId, orientation, containerDimensions) {
        const assetData = this.assets.get(assetId);
        if (!assetData) return;

        const { gameObject, config } = assetData;
        const transform = config[orientation];

        // Set origin from config
        if (transform.origin) {
            gameObject.setOrigin(transform.origin.x, transform.origin.y);
        }

        // Calculate bounding box
        const boundingBox = this.calculateBoundingBox(transform, containerDimensions);
        if (!boundingBox) return;

        // Apply the transform using ImageFitter
        const fitterOptions = {
            scaleMode: transform.scaleMode,
            maintainAspectRatio: transform.maintainAspectRatio,
            widthPercentage: 1,
            heightPercentage: 1
        };

        const fitResult = ImageFitter.fitToContainer(gameObject, boundingBox, fitterOptions);

        // Position the asset
        this.positionAsset(gameObject, transform, containerDimensions);

        // Apply rotation
        gameObject.setRotation(transform.rotation);

        // Update last known state
        assetData.lastKnownState = {
            x: gameObject.x,
            y: gameObject.y,
            scale: fitResult.scale,
            rotation: transform.rotation,
            transform: transform
        };

        // Set visibility (but don't override runtime changes)
        if (gameObject.visible !== !transform.isVisible) {
            gameObject.setVisible(transform.isVisible !== false);
        }
        console.log("updateAssetTransform ", config.name, gameObject.width, gameObject.height, gameObject.x, gameObject.y);
    }

    updateLayout() {
        const width = this.scene.scale.width;
        const height = this.scene.scale.height;
        const orientation = width > height ? 'landscape' : 'portrait';

        console.log('\n=== Layout Update ===');
        console.log('Screen Dimensions:', {
            width,
            height,
            orientation
        });

        console.log("updateLayout ", this.config.containers);

        this.updateContainersRecursive(this.config.containers, null, width, height, orientation);
    }

    updateContainersRecursive(containers, parentDimensions, sceneWidth, sceneHeight, orientation) {
        Object.entries(containers).forEach(([containerId, containerConfig]) => {
            console.log("updateContainerRecursive ", containerId);
            const containerData = this.containers.get(containerId);
            if (!containerData) return;

            const container = containerData.container;
            const config = containerConfig[orientation];

            // Calculate container dimensions
            const parentWidth = parentDimensions ? parentDimensions.width : sceneWidth;
            const parentHeight = parentDimensions ? parentDimensions.height : sceneHeight;
            const parentX = parentDimensions ? parentDimensions.x : 0;
            const parentY = parentDimensions ? parentDimensions.y : 0;

            const containerWidth = parentWidth * config.width;
            const containerHeight = parentHeight * config.height;
            const containerX = parentWidth * config.x;
            const containerY = parentHeight * config.y;

            container.setPosition(containerX, containerY);
            container.setSize(containerWidth, containerHeight);
            console.log("updateContainerRecursive1 ", containerId, parentDimensions, containerX, containerY, containerWidth, containerHeight);

            // Update assets in this container
            if (containerConfig.assets) {
                Object.entries(containerConfig.assets).forEach(([assetId, assetConfig]) => {
                    console.log("container config assets ", containerId, assetId);
                    this.updateAssetTransform(assetId, orientation, {
                        width: containerWidth,
                        height: containerHeight,
                        x: containerX,
                        y: containerY
                    });
                });
            }

            // Update child containers
            if (containerConfig.children) {
                console.log(`\nProcessing children of ${containerId}`);
                this.updateContainersRecursive(
                    containerConfig.children,
                    { width: containerWidth, height: containerHeight, x: containerX, y: containerY },
                    sceneWidth,
                    sceneHeight,
                    orientation
                );
            }
        });
    }

    calculateBoundingBox(transform, containerDimensions) {
        if (transform.position.reference === 'container') {
            // For container references, multiply container dimensions by size values
            const box = {
                width: containerDimensions.width * transform.size.width,
                height: containerDimensions.height * transform.size.height,
                x: containerDimensions.x,
                y: containerDimensions.y
            };
            console.log('Container-referenced bounding box:', box);
            return box;
        }

        // Look up the asset by name first, then fall back to ID if not found
        const referenceAsset = this.assets.get(this.nameToId.get(transform.position.reference)) || this.assets.get(transform.position.reference);
        if (!referenceAsset) {
            console.warn(`Reference asset not found: ${transform.position.reference}`);
            return null;
        }

        // For asset references, multiply referenced asset's display dimensions by size values
        const box = {
            width: referenceAsset.gameObject.displayWidth * transform.size.width,
            height: referenceAsset.gameObject.displayHeight * transform.size.height,
            x: referenceAsset.gameObject.x,
            y: referenceAsset.gameObject.y
        };
        
        console.log('Asset-referenced bounding box:', {
            reference: transform.position.reference,
            referenceDimensions: {
                width: referenceAsset.gameObject.displayWidth,
                height: referenceAsset.gameObject.displayHeight
            },
            sizeMultipliers: transform.size,
            calculatedBox: box
        });
        return box;
    }

    positionAsset(gameObject, transform, containerDimensions) {
        const startPos = {
            x: gameObject.x,
            y: gameObject.y
        };

        if (transform.position.reference === 'container') {
            gameObject.setPosition(
                transform.position.x * containerDimensions.width,
                transform.position.y * containerDimensions.height
            );
        } else {
            // Look up the asset by name first, then fall back to ID if not found
            const referenceAsset = this.assets.get(this.nameToId.get(transform.position.reference)) || this.assets.get(transform.position.reference);
            if (!referenceAsset) return;

            const refObject = referenceAsset.gameObject;
            gameObject.setPosition(
                transform.position.x * refObject.displayWidth + refObject.x,
                transform.position.y * refObject.displayHeight + refObject.y
            );
        }

        console.log('Position Change:', {
            from: startPos,
            to: {
                x: gameObject.x,
                y: gameObject.y
            },
            reference: transform.position.reference
        });
    }

    addDebugVisual(container, color, alpha) {
        const graphics = this.scene.add.graphics();
        graphics.lineStyle(2, color, 1);
        graphics.fillStyle(color, alpha);
        container.add(graphics);
        container.debugGraphics = graphics;
    }

    updateDebugVisual(container, width, height) {
        if (!container.debugGraphics) return;
        
        container.debugGraphics.clear();
        container.debugGraphics.lineStyle(2, 0x00ff00, 1);
        container.debugGraphics.fillStyle(0x00ff00, 0.3);
        container.debugGraphics.strokeRect(-width/2, -height/2, width, height);
        container.debugGraphics.fillRect(-width/2, -height/2, width, height);
    }

    getContainer(id) {
        return this.containers.get(id)?.container;
    }

    getAsset(nameOrId) {
        // Try looking up by name first, then fall back to ID
        const assetData = this.assets.get(this.nameToId.get(nameOrId)) || this.assets.get(nameOrId);
        return assetData?.gameObject;
    }

    getAbsolutePosition(gameObject) {
        if (!gameObject) return { x: 0, y: 0 };
    
        // Start with object's position adjusted for origin
        let x = gameObject.x - (gameObject.originX * gameObject.displayWidth);
        let y = gameObject.y - (gameObject.originY * gameObject.displayHeight);
        let currentContainer = gameObject.parentContainer;
        let currentScale = { x: gameObject.scaleX, y: gameObject.scaleY };
        let currentRotation = gameObject.rotation;
    
        while (currentContainer) {
            // Apply container transformations
            const containerScale = { 
                x: currentContainer.scaleX, 
                y: currentContainer.scaleY 
            };
            
            // Transform position through container hierarchy
            const transformedPoint = this.transformPoint(
                x, y, 
                currentContainer.x, 
                currentContainer.y,
                containerScale,
                currentContainer.rotation
            );
            
            x = transformedPoint.x;
            y = transformedPoint.y;
            
            // Accumulate transformations
            currentScale.x *= containerScale.x;
            currentScale.y *= containerScale.y;
            currentRotation += currentContainer.rotation;
            
            currentContainer = currentContainer.parentContainer;
        }
    
        return { x, y, scale: currentScale, rotation: currentRotation };
    }
    
    // Add helper function
    transformPoint(x, y, containerX, containerY, scale, rotation) {
        // Apply scale
        x *= scale.x;
        y *= scale.y;
        
        // Apply rotation
        if (rotation !== 0) {
            const cos = Math.cos(rotation);
            const sin = Math.sin(rotation);
            const rx = x * cos - y * sin;
            const ry = x * sin + y * cos;
            x = rx;
            y = ry;
        }
        
        // Add container offset
        return {
            x: x + containerX,
            y: y + containerY
        };
    }
    
    destroy() {
        this.containers.forEach(({container}) => {
            container.destroy();
        });
        this.containers.clear();
        this.assets.clear();
        this.nameToId.clear();
    }
}