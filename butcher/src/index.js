'use-strict';

const butcher = require('./butcher');
const sewer = require('./sewer');
const display = require('./display');
const readFromStream = require('./readFromStream');
const transformPoints = require('./transform-points');


readFromStream.loadImageAndPoints(6, true).then(([image, points]) => {
  const parts = butcher
    .cutHeadBodyLegs(image, transformPoints(points, image.width, image.height, true));


  sewer.sewHeadBodyLegs(
    {
      head: parts[0].croped,
      body: parts[1].croped,
      leg: parts[2].croped,
    },
    {
      neckHead: parts[0].points[1],
      neckBody: parts[1].points[1],
      hipBody: parts[1].points[2],
      hipLeg: parts[2].points[2],
    },
  );


  // display.images(parts.map(part => part.croped), { width: '33%' });
});
//
// readFromStream.loadPartsImagesAndPoint([4, 0, 5])
//   .then(([imageHead, pointHead, imageBody, pointBody, imageLeg, pointLeg]) => {
//     sewer.sew([imageHead, imageBody, imageLeg], [pointHead, pointBody, pointLeg]);
//   });
