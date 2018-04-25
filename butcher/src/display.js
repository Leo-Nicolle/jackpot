'use-strict';


const display = {

  data64(data64, options) {
    const { width, addToDom } = Object.assign({ width: '100%', addToDom: true }, options);

    const img = document.createElement('img');
    img.onload = function () {
      img.style.width = width;
    };
    img.src = data64;
    if (addToDom) {
      document.body.appendChild(img);
    }
    return img;
  },

  image(image, options) {
    const data64 = `data:image/png;base64, ${image.toBase64('image/png')}`;
    return display.data64(data64, options);
  },

  joints(image, joints, options) {
    const { width, addToDom } = Object.assign({ width: '100%', addToDom: true }, options);

    const domImage = display.image(image, { addToDom: false, w: image.width, h: image.height });
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.style.width = width;

    const fillStyles = ['red', 'green', 'blue', 'salmon'];
    const ctx = canvas.getContext('2d');
    domImage.onload = () => {
      ctx.drawImage(domImage, 0, 0);
      joints.forEach(({ x, y }, i) => {
        ctx.fillStyle = fillStyles[i % fillStyles.length];
        ctx.fillRect(x - 3, y - 3, 9, 9);
      });
    };
    if (addToDom) {
      document.body.appendChild(canvas);
    }
    return canvas;
  },

  rois(image, rois, options) {
    const { width, addToDom } = Object.assign({ width: '100%', addToDom: true }, options);

    const domImage = display.image(image, { addToDom: false, w: image.width, h: image.height });
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.style.width = width;

    const ctx = canvas.getContext('2d');
    domImage.onload = () => {
      ctx.drawImage(domImage, 0, 0);
      ctx.strokeStyle = 'red';
      rois.forEach(({
        minX, minY, maxX, maxY,
      }) => {
        ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
      });
    };
    if (addToDom) {
      document.body.appendChild(canvas);
    }
    return canvas;
  },

  images(images, options) {
    images.forEach((image) => {
      display.image(image, options);
    });
  },

};

module.exports = display;
