'use-strict';

const { Image } = require('image-js');

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

  floodFillRec(image, seed, result, constraints) {
    if (seed.x > image.width - 1 || seed.y > image.height - 1) return;
    if (seed.x < 0 || seed.y < 0) return;
    if (butcher.checkConstraints(seed, constraints)) return;
    if (result.image.getPixelXY(seed.x, seed.y)[0] > 0) return;

    const boundariesX = [seed.x, seed.x];
    for (let i = seed.x; i >= constraints.minX; i--) {
      if (!butcher.floodFillOnePixel(image, { x: i, y: seed.y }, result.image, constraints)) {
        boundariesX[0] = i + 1;
        break;
      }
    }
    for (let i = seed.x + 1; i < Math.min(image.width, constraints.maxX); i++) {
      if (!butcher.floodFillOnePixel(image, { x: i, y: seed.y }, result.image, constraints)) {
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
        butcher.floodFillRec(image, { x, y: seed.y + direction }, result, constraints, [-1, 1]);
      }
    });
  },

  floodFill(image, seed, constraints) {
    butcher.monkeyPatchBWImage(image);
    constraints = Object.assign({
      maxX: Infinity, maxY: Infinity, minX: 0, minY: 0,
    }, constraints);
    const result = {
      image: new Image(image.width, image.height, { kind: 'GREY' }),
      roi: {
        minX: seed.x, minY: seed.y, maxX: seed.x, maxY: seed.y,
      },
    };
    butcher.floodFillRec(image, seed, result, constraints);
    return result;
  },

  binaryAnd(image, mask) {
    const result = image.clone();
    const zeroPixel = [];
    for (let i = 0; i < image.components; i++) zeroPixel.push(0);

    for (let y = 0; y < image.height; y++) {
      for (let x = 0; x < image.width; x++) {
        if (!mask.getBitXY(x, y)) {
          result.setPixelXY(x, y, zeroPixel);
        }
      }
    }
    return result;
  },

  cutBorders(image, roi) {
    // const img = document.createElement('img');
    // const width = roi.maxX - roi.minX;
    // const height = roi.maxY - roi.minY;
    // const canvas = document.createElement('canvas');
    // const ctx = canvas.getContext('2d');
    //
    // // When the event "onload" is triggered we can resize the image.
    // img.onload = function () {
    //   img.width = image.width;
    //   img.height = image.height;
    //   ctx.drawImage(img, 0, 0);
    //   img.src = `data:image/png;base64, ${image.toBase64('image/png')}`;
    // };
    // // We put the Data URI in the image's src attribute
    // // ctx.drawImage(img, -roi.minX, -roi.minY, width, height);
    //
    // canvas.width = width;
    // canvas.height = height;
    // document.body.appendChild(canvas);
    // return canvas.toDataURL();
  },

  cutHeadBodyLegs(image, points) {
    points = Object.assign({
      head: { x: 0, y: 0 },
      shoulderCenter: { x: 0, y: 0 },
      spineBase: { x: 0, y: 0 },
    }, points);
    console.log(points);
    image.setPixelXY(points.head.x, points.head.y, [255, 0, 0]);
    image.setPixelXY(points.head.x + 1, points.head.y, [255, 0, 0]);
    image.setPixelXY(points.head.x + 2, points.head.y, [255, 0, 0]);
    image.setPixelXY(points.head.x + 1, points.head.y + 1, [255, 0, 0]);


    const head = butcher.floodFill(image, points.head, { maxY: points.shoulderCenter.y });

    return { head };
    // const headMask = head.image.mask({ threshold: 127, invert: true });
    // const noHead = butcher.binaryAnd(image, headMask);
    // const seed = {
    //   x: (points.shoulderCenter.x + points.spineBase.x) / 2,
    //   y: (points.shoulderCenter.y + points.spineBase.y) / 2,
    // };
    // const body = butcher.floodFill(noHead, seed, { maxY: points.spineBase.y });
    //
    // const bodyMask = body.image.mask({ threshold: 127, invert: true });
    // const noBody = butcher.binaryAnd(image, bodyMask);
    // const legs = butcher.floodFill(noBody, { x: points.spineBase.x, y: points.spineBase.y + 1 });
    //
    // head.croped = butcher.cutBorders(head.image, head.roi);
    // return { head, body, legs };
  },

};

module.exports = butcher;
