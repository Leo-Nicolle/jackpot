'use-strict';

const THREE = require('three');

const loader = new THREE.ImageLoader();

const buildTexture = {

  imageDom: null,

  load() {
    loader.load(
      // resource URL
      'test.jpg',

      // onLoad callback
      (image) => {
        image.width = 200;
        image.height = 200;

        // // use the image, e.g. draw part of it on a canvas
        // const canvas = document.createElement('canvas');
        // const context = canvas.getContext('2d');
        // context.drawImage(image, 1000, 0);

        document.body.appendChild(image);
      },
      undefined,
      () => {
        console.error('An error happened.');
      },
    );
  },


};

module.exports = buildTexture;
