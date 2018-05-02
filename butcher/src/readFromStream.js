'use-strict';

const { Image } = require('image-js');
const request = require('request-promise-lite');
const fs = require('fs');

const readFromStream = {

  INPUT_IMAGES_DIR: 'sample/imagesout',

  loadPoints(number) {
    console.log('request points');
    // return request.get('http://localhost:3000/test.json', { json: true });
    return request.get(`http://localhost:3000/sample/points/${number}.json`, { json: true });
  },

  loadImage(number, file = true) {
    if (number === undefined) {
      number = fs.readdirSync(this.INPUT_IMAGES_DIR).length;
    }
    console.log('request image', file);
    if (file) {
      return Image.load(`${this.INPUT_IMAGES_DIR}/TDMovieOut.${number}.jpg`);
    }
    return Image.load(`http://localhost:3000/sample/${this.INPUT_IMAGES_DIR}/TDMovieOut.${number}.jpg`);
  },

  loadImageAndPoints(number, file = true) {
    return Promise.all([
      readFromStream.loadImage(number, file),
      readFromStream.loadPoints(number),
    ]);
  },

  loadPartPoints(number) {
    return request.get(`http://localhost:3000/parts/point/${number}.json`, { json: true });
  },
  loadPartImage(type, number) {
    return Image.load(`http://localhost:3000/parts/${type}/${number}.png`);
  },

  loadPartsImagesAndPoint([numberHead, numberBody, numberLeg]) {
    return Promise.all([
      readFromStream.loadPartImage('head', numberHead),
      readFromStream.loadPartPoints(numberHead),
      readFromStream.loadPartImage('body', numberBody),
      readFromStream.loadPartPoints(numberBody),
      readFromStream.loadPartImage('leg', numberLeg),
      readFromStream.loadPartPoints(numberLeg),
    ]);
  },

};
module.exports = readFromStream;
