'use-strict';

const butcher = require('./butcher');
const display = require('./display');
const readFromStream = require('./readFromStream');
const transformPoints = require('./transform-points');


readFromStream.loadImageAndPoints(9, false).then(([image, points]) => {
  // const parts = butcher
  //   .cutHeadBodyLegs(image, transformPoints(points, image.width, image.height, true));

  const parts = butcher
    .cutHeadBodyLegs(image, transformPoints(points, image.width, image.height, true));
  // display.images(parts.map(part => part.croped), { width: '33%' });
});
