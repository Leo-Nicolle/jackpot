'use-strict';

const PNG = require('pngjs').PNG;
const fs = require('fs');

const ROOT = 'parts/';
const HEADDIR = `${ROOT}head/`;
const BODYDIR = `${ROOT}body/`;
const LEGDIR = `${ROOT}leg/`;
const POINTDIR = `${ROOT}point/`;


const write = {

  parts(parts) {
    const num = fs.readdirSync(HEADDIR).length;
    parts.forEach((part, i) => {
      const folder = i === 0 ? HEADDIR
        : i === 1 ? BODYDIR
          : LEGDIR;
      if (!part.croped.data) return;
      write.image(part.croped, `${folder + num}.png`);
    });

    // write points:
    // const points = {
    //   head: parts[0].points,
    //   body: parts[1].points,
    //   leg: parts[2].points,
    // };
    // write.points(points, `${POINTDIR + num}.json`);
  },

  image(image, filename) {
    const png = new PNG({
      width: image.width,
      height: image.height,
    });

    png.data = image.data;
    png.pack().pipe(fs.createWriteStream(filename));
  },


  points(points, filename) {
    fs.writeFileSync(filename, JSON.stringify(points));
  },

  _checkDirs() {
    write._createIfNotExists(ROOT);
    write._createIfNotExists(HEADDIR);
    write._createIfNotExists(BODYDIR);
    write._createIfNotExists(LEGDIR);
    write._createIfNotExists(POINTDIR);
  },

  _createIfNotExists(path) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
  },
};


module.exports = write;
