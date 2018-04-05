'use-strict';

const { Image } = require('image-js');
const request = require('request-promise-lite');

const readFromStream = {

  loadPoints(number) {
    console.log('request points');
    return request.get(`http://localhost:3000/sample/points/${number}.json`, { json: true });
  },

  loadImage(number, file = true) {
    console.log('request image');
    if (file) {
      return Image.load(`sample/imagesout/TDMovieOut.${number}.jpg`);
    }
    return Image.load(`http://localhost:3000/sample/imagesout/TDMovieOut.${number}.jpg`);
  },

  loadImageAndPoints(number) {
    return Promise.all([readFromStream.loadImage(number),
      readFromStream.loadPoints(number),
    ]);
  },


};
module.exports = readFromStream;
