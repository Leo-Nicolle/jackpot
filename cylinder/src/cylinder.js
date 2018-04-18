'use-strict';

const THREE = require('three');

const TWEEN = require('@tweenjs/tween.js');

const buildTexture = require('./build-texture');

const easingTime = 2000;
const pi2 = 2 * Math.PI;
const rotationSpeed = 2 * pi2 / easingTime;
const discret = pi2 / 4;

const rotation = { y: 0, start: 0 };

let texture = {};
let material;
const cylinder = {

  state: {
    rotationStartTime: 0,
    rotationTargetAngle: 0,
    hasStarted: false,
    accelerating: false,
    delta: 0,
  },

  mesh: null,

  initialize(scene) {
    document.addEventListener('keyup', cylinder.onDocumentKeyDown, false);


    const geometry = new THREE.CylinderGeometry(1, 1, 1, 12);
    texture = buildTexture.loadAndBuildTexture([1, 2, 3, 4], { partName: 'leg' });
    // const loader = new THREE.TextureLoader();
    // texture = loader.load('../assets/texture1.png', () => {});
    material = new THREE.MeshBasicMaterial({ map: texture });
    const parent = new THREE.Object3D();
    parent.rotation.y = -discret / 2;
    const mesh = new THREE.Mesh(geometry, material);

    parent.add(mesh);
    scene.add(parent);
    cylinder.mesh = mesh;
    return cylinder;
  },

  animate(delta) {
    texture.needsUpdate = true;
    if (this.state.linear) {
      cylinder.mesh.rotation.y += delta * rotationSpeed;
    }
  },

  startAnimation() {
    if (cylinder.state.hasStarted) return;
    cylinder.state.rotationStartTime = Date.now();
    cylinder.state.hasStarted = true;
    cylinder.state.accelerating = true;

    const maxRotation = cylinder.mesh.rotation.y + pi2;

    new TWEEN.Tween(cylinder.mesh.rotation)
      .to({ y: maxRotation }, easingTime)
      .easing(TWEEN.Easing.Quadratic.In)
      .onComplete(() => this.startLinear())
      .start();
  },

  startLinear() {
    this.state.linear = true;
  },
  stopLinear() {
    this.state.linear = false;
    const angleMore = Math.PI / 10;
    const deltaEnd = cylinder.mesh.rotation.y % (discret);
    const distance = pi2 - deltaEnd + angleMore;
    const endRotation = cylinder.mesh.rotation.y + distance;

    const tween1 = new TWEEN.Tween(cylinder.mesh.rotation)
      .to({ y: endRotation }, 2 * distance / rotationSpeed)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onComplete(() => {
        rotation.y = 0;
        rotation.start = cylinder.mesh.rotation.y;
      });

    const time2 = angleMore / rotationSpeed;

    const tween2 = new TWEEN.Tween(rotation)
      .to({ y: angleMore }, 6 * time2)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onUpdate(() => {
        cylinder.mesh.rotation.y = rotation.start - rotation.y;
      })
      .onComplete(() => {
        cylinder.state.hasStarted = false;
      });

    tween1.chain(tween2);
    tween1.start();
  },


  onDocumentKeyDown(event) {
    if (event.key === 's') {
      cylinder.startAnimation();
    }
    if (event.key === 'd') {
      cylinder.stopLinear();
    }
    if (event.key === 'c') {
      texture = buildTexture.loadAndBuildTexture([1, 2, 3, 4], { partName: 'head' });
      material.map = texture;
    }
  },

};

module.exports = cylinder;
