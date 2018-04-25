'use-strict';

const { Image } = require('image-js');
const display = require('./display');


const butcher = {
  monkeyPatchBWImage(image) {
    image.getBWXY = function (x, y) {
      return this.getPixelXY(x, y)[0];
    };
    image.setBWXY = function (x, y, value) {
      this.setPixelXY(x, y, [value]);
    };
  },

  checkConstraints(seed, constraints) {
    return seed.x > constraints.maxX ||
      seed.x < constraints.minX ||
      seed.y > constraints.maxY ||
      seed.y < constraints.minY;
  },

  floodFillOnePixel(image, seed, result, constraints) {
    if (butcher.checkConstraints(seed, constraints)) return false;
    if (image.getBWXY(seed.x, seed.y) > 0) {
      result.setPixelXY(seed.x, seed.y, [255]);
      return true;
    }
    result.setPixelXY(seed.x, seed.y, [1]);
    return false;
  },

  floodFillRec(image, seeds, result, constraints) {
    while (seeds.length > 0) {
      const seed = seeds[0];
      seeds.shift();
      if (seed.x > image.width - 1 || seed.y > image.height - 1) continue;
      if (seed.x < 0 || seed.y < 0) continue;
      if (butcher.checkConstraints(seed, constraints)) continue;
      if (result.mask.getPixelXY(seed.x, seed.y)[0] > 0) continue;

      const boundariesX = [seed.x, seed.x];
      for (let i = seed.x; i >= constraints.minX; i--) {
        if (!butcher.floodFillOnePixel(image, { x: i, y: seed.y }, result.mask, constraints)) {
          boundariesX[0] = i + 1;
          break;
        }
      }
      for (let i = seed.x + 1; i < Math.min(image.width, constraints.maxX); i++) {
        if (!butcher.floodFillOnePixel(image, { x: i, y: seed.y }, result.mask, constraints)) {
          boundariesX[1] = i;
          break;
        }
      }
      // assign Roi
      result.roi.minX = Math.min(boundariesX[0], result.roi.minX);
      result.roi.minY = Math.min(seed.y, result.roi.minY);
      result.roi.maxX = Math.max(boundariesX[1], result.roi.maxX);
      result.roi.maxY = Math.max(seed.y, result.roi.maxY);

      // recursion
      [-1, 1].forEach((direction) => {
        const y = seed.y + direction;
        if (y < 0 || y > image.height - 1) return;
        for (let x = boundariesX[0]; x < boundariesX[1]; x++) {
          seeds.push({ x, y: seed.y + direction });
        }
      });
    }
  },

  floodFill(image, seed, constraints) {
    butcher.monkeyPatchBWImage(image);
    constraints = Object.assign({
      maxX: Infinity, maxY: Infinity, minX: 0, minY: 0,
    }, constraints);
    const result = {
      mask: new Image(image.width, image.height, { kind: 'GREY' }),
      roi: {
        minX: seed.x, minY: seed.y, maxX: seed.x, maxY: seed.y,
      },
    };
    butcher.floodFillRec(image, [seed], result, constraints);
    console.log('roi', result.roi);
    return result;
  },

  extract(image, parts, points) {
    parts.forEach((part, i) => {
      // mask the image
      const masked = image.paintMasks(part.mask);
      if (part.roi.maxX - part.roi.minX <= 0 || part.roi.maxY - part.roi.minY <= 0) {
        part.croped = part.mask;
        console.log('error');
        return;
      }
      // add alpha channel
      const rgba = new Image(image.width, image.height, { kind: 'RGBA' });
      rgba.setChannel('r', masked.getChannel('r'));
      rgba.setChannel('g', masked.getChannel('g'));
      rgba.setChannel('b', masked.getChannel('b'));
      rgba.setChannel('a', part.mask);

      // crop
      const croped = rgba.crop({
        x: part.roi.minX,
        y: part.roi.minY,
        width: part.roi.maxX - part.roi.minX,
        height: part.roi.maxY - part.roi.minY,
      });
      part.croped = croped;

      // add point:
      const point = {
        x: Math.min(Math.max(points[i].x - part.roi.minX, 0), croped.width),
        y: Math.min(Math.max(points[i].y - part.roi.minY, 0), croped.height),
      };
      console.log(point);
      part.point = point;
    });

    return parts;
  },

  cutHeadBodyLegs(image, points) {
    const { head, hip, neck } = points;
    const grey = image.grey();
    const headPart = butcher.floodFill(grey, head, { maxY: neck.y });
    const noHead = grey.subtract(headPart.mask);
    const bodyPart = butcher.floodFill(noHead, {
      x: neck.x,
      y: neck.y + 1,
    }, { maxY: hip.y });
    const noBody = noHead.subtract(bodyPart.mask);
    const legPart = butcher.floodFill(noBody, { x: hip.x, y: hip.y + 1 });

    // add name:
    headPart.name = 'head';
    bodyPart.name = 'body';
    legPart.name = 'leg';

    const parts = [headPart, bodyPart, legPart];
    butcher.extract(image, parts, [head, hip, hip]);

    // display.images(parts.map(part => part.croped), { width: '33%' });
    // display.rois(image, [head.roi, body.roi, leg.roi]);
    parts.forEach((part) => {
      display.joints(part.croped, [part.point], { width: '25%' });
    });

    // display.image(headPart.mask);
    // display.image(body.mask);
    // display.image(leg.mask);

    return parts;
  },

};

module.exports = butcher;
