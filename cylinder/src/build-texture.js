'use-strict';

const THREE = require('three');

const loader = new THREE.ImageLoader();

const buildTexture = {

  imageDom: null,

  load(partName, numbers = []) {
    const res = [];
    numbers.forEach((number) => {
      const image = loader.load(
      // resource URL
        `parts/${partName}/${number}.png`,
        // onLoad callback
        img => img,
        undefined,
        () => {
          console.error('An error happened.');
        },
      );
      res.push(image);
    });
    console.log('image', res);
    return res;
  },

  buildTexture(images, width, height) {
    const globalCanvas = document.createElement('canvas');
    globalCanvas.width = images.length * width;
    globalCanvas.height = height;
    const globalContext = globalCanvas.getContext('2d');

    const imageCanvas = document.createElement('canvas');
    imageCanvas.width = width;
    imageCanvas.height = height;

    images.forEach((image, i) => {
      // resizes the image if it is too large
      // image.width = Math.min(width, image.width);
      // image.height = Math.min(height, image.height);

      // draws it
      globalContext.drawImage(image, i * width, 0);
    });
    // draws the image on the small canvas:
    document.body.appendChild(globalCanvas);
    return new THREE.Texture(globalCanvas);
  },

  loadAndBuildTexture(numbers, options = {}) {
    const { width, height, partName } = Object.assign({
      width: 128,
      height: 128,
      partName: 'head',
    }, options);

    const images = this.load(partName, numbers);
    return this.buildTexture(images, width, height);
  },

};

module.exports = buildTexture;
