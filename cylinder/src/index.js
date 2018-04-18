const THREE = require('three');
const cylinder = require('./cylinder');
const TWEEN = require('@tweenjs/tween.js');
const buildTexture = require('./build-texture');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
camera.position.z = 5;

buildTexture.load('head', [0, 1, 2, 3, 4]);
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

function initializeEvents() {
  window.addEventListener('resize', onWindowResize, false);
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
