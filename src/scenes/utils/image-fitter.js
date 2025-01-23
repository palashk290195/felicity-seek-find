// src/scenes/utils/image-fitter.js
export class ImageFitter {
    static SCALE_MODE = {
        FIT: 'fit',
        FILL: 'fill',
        STRETCH: 'stretch'
    };

    static fitToContainer(gameObject, boundingBox, options = {}) {
        const {
            scaleMode = this.SCALE_MODE.FIT,
            maintainAspectRatio = true,
            widthPercentage = 1,
            heightPercentage = 1
        } = options;

        // Handle both images and videos
        const naturalWidth = gameObject.width;
        const naturalHeight = gameObject.height;
        const naturalRatio = naturalWidth / naturalHeight;

        // Calculate target dimensions
        const targetWidth = boundingBox.width * widthPercentage;
        const targetHeight = boundingBox.height * heightPercentage;
        const targetRatio = targetWidth / targetHeight;

        let finalWidth, finalHeight;

        if (!maintainAspectRatio || scaleMode === this.SCALE_MODE.STRETCH) {
            finalWidth = targetWidth;
            finalHeight = targetHeight;
        } else if (scaleMode === this.SCALE_MODE.FIT) {
            if (targetRatio > naturalRatio) {
                finalHeight = targetHeight;
                finalWidth = targetHeight * naturalRatio;
            } else {
                finalWidth = targetWidth;
                finalHeight = targetWidth / naturalRatio;
            }
        } else if (scaleMode === this.SCALE_MODE.FILL) {
            if (targetRatio > naturalRatio) {
                finalWidth = targetWidth;
                finalHeight = targetWidth / naturalRatio;
            } else {
                finalHeight = targetHeight;
                finalWidth = targetHeight * naturalRatio;
            }
        }

        const scaleX = finalWidth / naturalWidth;
        const scaleY = finalHeight / naturalHeight;
        gameObject.setScale(scaleX, scaleY);

        return {
            width: finalWidth,
            height: finalHeight,
            scale: { x: scaleX, y: scaleY }
        };
    }
}