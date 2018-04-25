'use-strict';

const fs = require('fs');
const butcher = require('./src/butcher');
const write = require('./src/write');

const readFromStream = require('./src/readFromStream');
const oscComunication = require('./src/osc-comunication');
const oscFakeServer = require('./src/osc-fake-server');
const transformPoints = require('./src/transform-points');

write._checkDirs();
/*
const fileNumber = 6;
oscComunication.initialize();

// start fake server for joints:
setTimeout(() => oscFakeServer.start(), 1000);


const stdin = process.stdin;
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');
stdin.on('data', (key) => {
  // ctrl-c ( end of text )
  if (key === '\u0003') {
    process.exit();
  }
  // write the key to stdout all normal like
  process.stdout.write(key);
  if (key === 'r') {
    fileNumber++;
    oscFakeServer.fileNumber = fileNumber;
    oscFakeServer._sendPoints();
    setTimeout(() =>
      readFromStream.loadImage(fileNumber).then((image) => {
        const points = oscComunication.getData();
        const parts = butcher
          .cutHeadBodyLegs(image, transformPoints(points, image.width, image.height));
        write.parts(parts);
      }), 1000);
  }
});
*/

// test for image proc pipeline

function readSampleAndWriteParts(number) {
  return readFromStream.loadImageAndPoints(number, true).then(([image, points]) => {
    console.log('start cut -- ', number);
    const parts = butcher.cutHeadBodyLegs(
      image,
      transformPoints(points, image.width, image.height, true),
    );
    write.parts(parts);
    return new Promise(() => console.log('succes -- ', number), () => console.log('error -- ', number));
  });
}
// Promise.all([7].map(i => readSampleAndWriteParts(i)));
Promise.all([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => readSampleAndWriteParts(i)));
