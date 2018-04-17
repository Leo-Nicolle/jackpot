const THREE = require('three');
const cylinder = require('./cylinder');
const TWEEN = require('@tweenjs/tween.js');
// const buildTexture = require('./build-texture');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, document.innerWidth / document.innerHeight, 1, 2000);
camera.position.z = 5;

// buildTexture.load();
function initializeRenderer() {
  const canvas = document.getElementById('canvas');
  canvas.width = 1024;
  canvas.height = 768;
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
  renderer.setPixelRatio(document.devicePixelRatio);
  renderer.setSize(document.innerWidth, document.innerHeight);
  renderer.setClearColor('#FFFFFF');
  return renderer;
}

function onWindowResize() {
  // camera.aspect = document.innerWidth / document.innerHeight;
  // camera.updateProjectionMatrix();
  // renderer.setSize(document.innerWidth, document.innerHeight);
}

function initializeEvents() {
  document.addEventListener('resize', onWindowResize, false);
}

function initializeScene(renderer) {
  return cylinder.initialize(scene, renderer);
}

const renderer = initializeRenderer(scene);
const head = initializeScene(scene, renderer);
initializeEvents();

let lastFrame = Date.now();
const animate = function (time) {
  const now = Date.now();
  const delta = now - lastFrame;
  lastFrame = now;
  TWEEN.update(time);

  head.animate(delta);
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

animate();
