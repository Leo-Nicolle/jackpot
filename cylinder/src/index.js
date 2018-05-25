const THREE = require('three');
const Cylinder = require('./cylinder');
const TWEEN = require('@tweenjs/tween.js');
// const buildTexture = require('./build-texture');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
camera.position.z = 8.5;
window.camera = camera;

// buildTexture.load('head', [1, 2, 3, 4]);
function initializeRenderer() {
  const canvas = document.getElementById('canvas');
  canvas.width = 1024;
  canvas.height = 768;
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor('#FFFFFF');
  return renderer;
}

function onWindowResize() {
  // camera.aspect = window.innerWidth / window.innerHeight;
  // camera.updateProjectionMatrix();
  // renderer.setSize(window.innerWidth, window.innerHeight);
}

function initializeEvents(cylinders) {
  window.addEventListener('resize', onWindowResize, false);
  document.addEventListener('keyup', (event) => {
    if (event.key === 's') {
      cylinders.forEach((cylinder, i) => {
        setTimeout(() => cylinder.startAnimation(), i * 1000);
      });
    }
    if (event.key === 'd') {
      setTimeout(() => cylinders[0].stopLinear());
    }
    if (event.key === 'f') {
      setTimeout(() => cylinders[1].stopLinear());
    }
    if (event.key === 'g') {
      setTimeout(() => cylinders[2].stopLinear());
    }
  });
}

function initializeScene(scene) {
  return [
    new Cylinder(scene, {
      position: new THREE.Vector3(0, 1.5, 0),
      partName: 'head',
    }),
    new Cylinder(scene, {
      position: new THREE.Vector3(0, 0, 0),
      scale: new THREE.Vector3(1, 2, 1),

      partName: 'body',
    }),
    new Cylinder(scene, {
      position: new THREE.Vector3(0, -2, 0),
      scale: new THREE.Vector3(1, 2, 1),
      partName: 'leg',
    }),

  ];
}

const renderer = initializeRenderer(scene);
const cylinders = initializeScene(scene);
window.cylinders = cylinders;
initializeEvents(cylinders);

let lastFrame = Date.now();
const animate = function (time) {
  const now = Date.now();
  const delta = now - lastFrame;
  lastFrame = now;
  TWEEN.update(time);

  cylinders.forEach(cylinder => cylinder.animate(delta));
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

animate();
