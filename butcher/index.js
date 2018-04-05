'use-strict';

const butcher = require('./src/butcher');
const write = require('./src/write');

const readFromStream = require('./src/readFromStream');

readFromStream.loadImageAndPoints(4).then(([image, points]) => {
  const parts = butcher.cutHeadBodyLegs(image, points);
  parts.forEach((part, i) => {
    write(part.croped, 'test.png');
  });
});
