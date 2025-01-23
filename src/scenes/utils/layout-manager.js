// src/scenes/utils/layout-manager.js
import { ImageFitter } from './image-fitter.js';

export class LayoutManager {
    constructor(scene, layoutConfig) {
        this.scene = scene;
        this.config = layoutConfig;
        this.containers = new Map();
        this.assets = new Map();
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

        this.assets.set(assetId, {
            gameObject,
            config,
            containerId,
            // Store last known position and transform for visibility toggling
            lastKnownState: {
                x: 0,
                y: 0,
                scale: { x: 1, y: 1 },
                rotation: initialTransform.rotation,
                transform: initialTransform
            }
        });

        // Add reference to scene for easy access
        this.scene[assetId] = gameObject;
        gameObject.name = assetId;

        // Set initial visibility
        gameObject.setVisible(initialTransform.isVisible !== false);

        // Add methods for visibility control
        gameObject.show = () => this.showAsset(assetId);
        gameObject.hide = () => this.hideAsset(assetId);
        gameObject.toggleVisibility = () => this.toggleAssetVisibility(assetId);

        containerData.container.add(gameObject);
    }

    // Add these new methods for visibility control
    showAsset(assetId) {
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

    hideAsset(assetId) {
        const assetData = this.assets.get(assetId);
        if (!assetData) return;

        const { gameObject } = assetData;
        
        // Update the config to reflect the change
        const orientation = this.scene.scale.width > this.scene.scale.height ? 'landscape' : 'portrait';
        assetData.config[orientation].isVisible = false;

        gameObject.setVisible(false);

        return gameObject;
    }

    toggleAssetVisibility(assetId) {
        const assetData = this.assets.get(assetId);
        if (!assetData) return;

        const { gameObject } = assetData;
        return gameObject.visible ? this.hideAsset(assetId) : this.showAsset(assetId);
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

        // Calculate asset's own bounding box based on reference and size
        const assetBoundingBox = {
            width: boundingBox.width * transform.size.width,
            height: boundingBox.height * transform.size.height
        };

        // Store the asset's bounding box for future reference
        assetData.boundingBox = assetBoundingBox;

        // Apply the transform using ImageFitter with the reference bounding box
        const fitterOptions = {
            scaleMode: transform.scaleMode,
            maintainAspectRatio: transform.maintainAspectRatio,
            widthPercentage: 1, // Use full bounding box since we've already applied size
            heightPercentage: 1
        };

        const fitResult = ImageFitter.fitToContainer(gameObject, assetBoundingBox, fitterOptions);

        // Position the asset
        this.positionAsset(gameObject, transform, containerDimensions);

        // Apply rotation
        gameObject.setRotation(transform.rotation);
        console.log("update asset transform ", assetId, boundingBox.width, boundingBox.height, transform.size.width, transform.size.height, assetBoundingBox.width, assetBoundingBox.height, gameObject.displayWidth, gameObject.displayHeight);

        // Update last known state
        assetData.lastKnownState = {
            x: gameObject.x,
            y: gameObject.y,
            scale: fitResult.scale,
            rotation: transform.rotation,
            transform: transform,
            boundingBox: assetBoundingBox
        };

        // Set visibility (but don't override runtime changes)
        if (gameObject.visible !== !transform.isVisible) {
            gameObject.setVisible(transform.isVisible !== false);
        }
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

        this.updateContainersRecursive(this.config.containers, null, width, height, orientation);
    }

    updateContainersRecursive(containers, parentDimensions, sceneWidth, sceneHeight, orientation) {
        Object.entries(containers).forEach(([containerId, containerConfig]) => {
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
            const containerX = parentX + (parentWidth * config.x);
            const containerY = parentY + (parentHeight * config.y);

            container.setPosition(containerX, containerY);
            container.setSize(containerWidth, containerHeight);

            console.log(`\nContainer: ${containerId}`);
            console.log('Config:', {
                orientation,
                original: config,
                parent: parentDimensions ? {
                    width: parentWidth,
                    height: parentHeight,
                    x: parentX,
                    y: parentY
                } : 'screen'
            });
            console.log('Calculated:', {
                x: containerX,
                y: containerY,
                width: containerWidth,
                height: containerHeight
            });

            // Update assets in this container
            if (containerConfig.assets) {
                Object.entries(containerConfig.assets).forEach(([assetId, assetConfig]) => {
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
            return containerDimensions;
        }

        const referenceAsset = this.assets.get(transform.position.reference);
        if (!referenceAsset) {
            console.warn(`Reference asset not found: ${transform.position.reference}`);
            return null;
        }

        // Use the stored bounding box of the reference asset if available
        // Otherwise fallback to its display dimensions
        const box = referenceAsset.boundingBox || {
            width: referenceAsset.gameObject.displayWidth,
            height: referenceAsset.gameObject.displayHeight
        };

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
            const referenceAsset = this.assets.get(transform.position.reference);
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

    getAsset(id) {
        return this.assets.get(id)?.gameObject;
    }

    destroy() {
        this.containers.forEach(({container}) => {
            container.destroy();
        });
        this.containers.clear();
        this.assets.clear();
    }
}