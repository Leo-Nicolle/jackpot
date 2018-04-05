'use-strict';

const { Image } = require('image-js');
const butcher = require('./butcher');
const http = require('http');


function drawData64(data64, options) {
  const { w, h, addToDom } = Object.assign({ w: 512, h: 512, addToDom: true }, options);
  const img = document.createElement('img');
  // When the event "onload" is triggered we can resize the image.
  img.onload = function () {
    img.width = w;
    img.height = h;
  };
  // We put the Data URI in the image's src attribute
  img.src = data64;
  if (addToDom) {
    document.body.appendChild(img);
  }
  return img;
}

function drawImage(image, options) {
  const data64 = `data:image/png;base64, ${image.toBase64('image/png')}`;
  return drawData64(data64, options);
}

function drawJoints(image, joints) {
  const domImage = drawImage(image, { addToDom: false, w: image.width, h: image.height });
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');

  domImage.onload = () => {
    ctx.drawImage(domImage, 0, 0);
    ctx.fillStyle = 'red';
    joints.forEach(({ x, y }) => {
      ctx.fillRect(x - 3, y - 3, 9, 9);
    });
  };
  document.body.appendChild(canvas);
  canvas.style.width = '100%';

  // drawData64(canvas.toDataURL());
}

Image.load('sample/imagesout/TDMovieOut.9.jpg').then((image) => {
  // image = image.resize({ factor: 0.25 });
  window.image = image;

  http.get('http://localhost:3000/sample/points/9.json', (res) => {
    const { statusCode } = res;
    const contentType = res.headers['content-type'];
    let error;
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' +
                      `Status Code: ${statusCode}`);
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error('Invalid content-type.\n' +
                      `Expected application/json but received ${contentType}`);
    }
    if (error) {
      console.error(error.message);
      // consume response data to free up memory
      res.resume();
      return;
    }

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData);
        const points = Object.values(parsedData).map(({ point }) => {
          const x = Math.round(point.u * image.width);
          const y = Math.round((1 - point.v) * image.height);
          return { x, y };
        });
        drawJoints(image, points);
        // const { head, body, legs } = butcher.cutHeadBodyLegs(image, {
        //   head: points[0],
        //   shoulderCenter: points[1],
        //   spineBase: points[2],
        // });
        // drawImage(head.image);
        // console.log(parsedData);
      } catch (e) {
        console.error(e.message);
      }
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });


  // drawImage(image);

  // drawData64(head.croped);
  // drawImage(body.image);
  // drawImage(legs.image);
});
