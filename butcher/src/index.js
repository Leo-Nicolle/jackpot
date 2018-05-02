'use-strict';

const butcher = require('./butcher');
const sewer = require('./sewer');
const display = require('./display');
const readFromStream = require('./readFromStream');
const transformPoints = require('./transform-points');


// sewer.test();
//
// readFromStream.loadImageAndPoints(0, false).then(([image, points]) => {
//   const parts = butcher
//     .cutHeadBodyLegs(image, transformPoints(points, image.width, image.height, true));
//
//   parts.forEach((part) => {
//     sewer.sewHeadBodyLegs(part.croped, part.point);
//   });
//
//
//   display.images(parts.map(part => part.croped), { width: '33%' });
// });

readFromStream.loadPartsImagesAndPoint([4, 0, 5])
  .then(([imageHead, pointHead, imageBody, pointBody, imageLeg, pointLeg]) => {
    sewer.sew([imageHead, imageBody, imageLeg], [pointHead, pointBody, pointLeg]);
  });
