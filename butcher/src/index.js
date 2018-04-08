'use-strict';

const butcher = require('./butcher');
const display = require('./display');
const readFromStream = require('./readFromStream');

readFromStream.loadImageAndPoints(6, false).then(([image, points]) => {
  const parts = butcher.cutHeadBodyLegs(image, points);

  display.images(parts.map(part => part.croped), { width: '33%' });
});
