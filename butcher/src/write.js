'use-strict';

const PNG = require('pngjs').PNG;
const fs = require('fs');

const write = function (image, filename) {
  console.log(image.whidth);
  // const png = new PNG({
  //   width: image.width,
  //   height: image.height,
  //   bitDepth: image.bitDepth,
  //   colorType: 6,
  //   inputColorType: 6,
  //   inputHasAlpha: false,
  // });
  //
  // png.data = image.data;
  // png.pack().pipe(fs.createWriteStream(filename));
};

module.exports = write;
