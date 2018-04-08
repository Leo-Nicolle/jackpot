'use-strict';

const butcher = require('./src/butcher');
const write = require('./src/write');

const readFromStream = require('./src/readFromStream');


function readSampleAndWriteParts(number) {
  return readFromStream.loadImageAndPoints(number, true).then(([image, points]) => {
    const parts = butcher.cutHeadBodyLegs(image, points);
    write.parts(parts);
    return new Promise(() => console.log(number), () => console.log('error', number));
  });
}

write._checkDirs();
Promise.all([5, 6, 7, 8, 9, 10, 11].map(i => readSampleAndWriteParts(i)));
