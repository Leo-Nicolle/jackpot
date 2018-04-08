'use-strict';

const PNG = require('pngjs').PNG;
const fs = require('fs');

const ROOT = 'parts/';
const HEADDIR = `${ROOT}head/`;
const BODYDIR = `${ROOT}body/`;
const LEGDIR = `${ROOT}leg/`;


const write = {

  parts(parts) {
    const num = fs.readdirSync('parts/head/').length;
    parts.forEach((part, i) => {
      const folder = i === 0 ? HEADDIR
        : i === 1 ? BODYDIR
          : LEGDIR;

      write.image(part.croped, `${folder + num}.png`);
    });
  },

  image(image, filename) {
    const png = new PNG({
      width: image.width,
      height: image.height,
      bitDepth: image.bitDepth,
      colorType: 6,
      inputColorType: 6,
      inputHasAlpha: false,
    });

    png.data = image.data;
    png.pack().pipe(fs.createWriteStream(filename));
  },

  _checkDirs() {
    write._createIfNotExists(ROOT);
    write._createIfNotExists(HEADDIR);
    write._createIfNotExists(BODYDIR);
    write._createIfNotExists(LEGDIR);
  },

  _createIfNotExists(path) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
  },
};


module.exports = write;
