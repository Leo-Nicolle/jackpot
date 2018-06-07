'use-strict';

const display = require('./display');


const sewer = {

  _checkConstraints(image, point) {
    return point.x < image.width && point.x > -1 &&
      point.y < image.height && point.y > -1 &&
      image.getPixelXY(point.x, point.y).reduce((total, value) => total + value, 0) > 0;
  },

  // seeks  for the best middle point
  seekForExtremum(image, point, direction) {
    let res = point.x;
    const seeds = [point];
    while (seeds.length > 0) {
      const seed = seeds[0];
      seeds.shift();
      if (!(
        sewer._checkConstraints(image, seed)
       || sewer._checkConstraints(image, { x: seed.x, y: seed.y - 1 })
       || sewer._checkConstraints(image, { x: seed.x, y: seed.y + 1 }))) continue;
      res = seed.x;
      seeds.push({ x: seed.x + direction, y: seed.y });
    }
    return res;
  },

  seekForMiddle(image, point) {
    const min = sewer.seekForExtremum(image, point, -1);
    const max = sewer.seekForExtremum(image, point, 1);
    return Math.round((min + max) / 2);
  },


  sewHeadBodyLegs(
    { head, body, leg },
    {
      neckHead, neckBody, hipBody, hipLeg,
    },
  ) {
    const images = [head, body, leg];
    const maxWidth = images.reduce((max, image) => Math.max(max, image.width), 0);
    const totalHeight = images.reduce((total, image) => total + image.height, 0);

    const canvas = document.createElement('canvas');
    canvas.width = maxWidth;
    canvas.height = totalHeight;
    const ctx = canvas.getContext('2d');

    display.joints(head, [neckHead], { width: '33%' });
    display.joints(body, [neckBody, hipBody], { width: '33%' });
    display.joints(leg, [hipLeg], { width: '33%' });

    const bodyShiftX = Math.round((maxWidth - body.width) / 2);
    const headShiftX = bodyShiftX + neckBody.x - neckHead.x;
    const legShiftX = bodyShiftX + hipBody.x - hipLeg.x;

    Promise.all(images.map(image => image.toDataURL()))
      .then((urls) => {
        urls.forEach((url, i) => {
          const domImage = document.createElement('img');
          domImage.onload = () => {
            if (i === 0) {
              ctx.drawImage(domImage, headShiftX, 0);
            } else if (i === 1) {
              ctx.drawImage(domImage, bodyShiftX, head.height - 1);
            } else {
              ctx.drawImage(domImage, legShiftX, head.height + body.height - 2);
            }
          };
          domImage.src = url;
        });
      });

    document.body.appendChild(canvas);
  },

  sew([head, body, leg], [headPoints, bodyPoints, legPoints]) {
    sewer.sewHeadBodyLegs([head, body, leg], {
      neckHead: headPoints.head[1],
      neckBody: bodyPoints.body[1],
      hipBody: bodyPoints.body[2],
      hipLeg: legPoints.leg[2],
    });
  },


};

module.exports = sewer;
