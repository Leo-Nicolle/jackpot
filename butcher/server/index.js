'use-strict';

const butcher = require('./butcher');
const sewer = require('./sewer');
const display = require('./display');
const readFromStream = require('./readFromStream');
const transformPoints = require('./transform-points');


readFromStream.loadPartsImagesAndPoint([0, 1, 2])
  .then(([head, headPoints, body, bodyPoints, leg, legPoints]) => {
    sewer.sewHeadBodyLegs(
      {
        head,
        body,
        leg,
      },
      {
        neckHead: headPoints.head[1],
        neckBody: bodyPoints.body[1],
        hipBody: bodyPoints.body[2],
        hipLeg: legPoints.leg[2],
      },
    );
  });
//
// readFromStream.loadPartsImagesAndPoint([4, 0, 5])
//   .then(([imageHead, pointHead, imageBody, pointBody, imageLeg, pointLeg]) => {
//     sewer.sew([imageHead, imageBody, imageLeg], [pointHead, pointBody, pointLeg]);
//   });
