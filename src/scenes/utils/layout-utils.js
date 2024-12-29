export function fitImageToContainer(image, container) {
    const containerWidth = container.width;
    const containerHeight = container.height;
    const imageAspectRatio = image.width / image.height;
    const containerAspectRatio = containerWidth / containerHeight;

    console.log(`Fitting image: ${image.texture.key}`); // Log the image name

    if (imageAspectRatio > containerAspectRatio) {
        image.setDisplaySize(containerWidth, containerWidth / imageAspectRatio);
        console.log(`Image fitted to width: ${containerWidth}, height: ${containerWidth / imageAspectRatio}`);
    } else {
        image.setDisplaySize(containerHeight * imageAspectRatio, containerHeight);
        console.log(`Image fitted to width: ${containerHeight * imageAspectRatio}, height: ${containerHeight}`);
    }
}

export function fitTextToContainer(textGameObject, container, content) {
    // Reset text properties
    textGameObject.setFontSize(100); // Start with large size
    textGameObject.setText(content);
    
    const containerWidth = container.width;
    const containerHeight = container.height;
    
    // Split text into lines if it contains \n
    const lines = content.split('\n');
    
    // Configure text properties
    textGameObject.setAlign('center');
    textGameObject.setOrigin(0.5, 0);
    textGameObject.setWordWrapWidth(containerWidth);
    
    // Binary search to find the largest font size that fits
    let minSize = 1;
    let maxSize = 200;
    let currentSize = 100;
    
    while (maxSize - minSize > 1) {
        currentSize = Math.floor((minSize + maxSize) / 2);
        textGameObject.setFontSize(currentSize);
        
        const textWidth = textGameObject.width;
        const textHeight = textGameObject.height;
        
        if (textWidth <= containerWidth && textHeight <= containerHeight) {
            minSize = currentSize;
        } else {
            maxSize = currentSize;
        }
    }
    
    // Set final font size slightly smaller to ensure fit
    textGameObject.setFontSize(minSize * 0.95);
    
    // Since container position is at center, text should be at 0,0 relative to container
    textGameObject.setPosition(0, 0);
    
    return textGameObject;
}

export function createBackground(gameWidth, gameHeight, backgroundAssetKey) {
    // Add background using the themed background key
    const bg = this.add.image(gameWidth/2, gameHeight/2, backgroundAssetKey);
    bg.setOrigin(0.5, 0.5);
    
    // Scale background to fit screen
    const scaleX = gameWidth / bg.width;
    const scaleY = gameHeight / bg.height;
    const scale = Math.max(scaleX, scaleY);
    bg.setScale(scale);
}