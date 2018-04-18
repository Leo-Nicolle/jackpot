'use-strict';

const THREE = require('three');

const TWEEN = require('@tweenjs/tween.js');

const buildTexture = require('./build-texture');

const easingTime = 2000;
const pi2 = 2 * Math.PI;
const rotationSpeed = 2 * pi2 / easingTime;
const discret = pi2 / 4;

const rotation = { y: 0, start: 0 };

let material;
const Cylinder = function (scene, options = {}) {
  const { scale, position, partName } = Object.assign({
    scale: new THREE.Vector3(1, 1, 1),
    position: new THREE.Vector3(1, 1, 1),
    partName: 'head',
  }, options);

  document.addEventListener('keyup', event => this.onDocumentKeyDown(event), false);
  const geometry = new THREE.CylinderGeometry(1, 1, 1, 32);
  let texture = buildTexture.loadAndBuildTexture([1, 2, 3, 4], { partName });
  // const loader = new THREE.TextureLoader();
  // const texture = loader.load('../assets/texture1.png', () => {});
  material = new THREE.MeshBasicMaterial({ map: texture });
  const parent = new THREE.Object3D();
  parent.rotation.y = -discret / 2;
  parent.scale.set(scale.x, scale.y, scale.z);
  parent.position.set(position.x, position.y, position.z);


  const mesh = new THREE.Mesh(geometry, material);
  parent.add(mesh);
  scene.add(parent);
  this.mesh = mesh;

  this.animate = function (delta) {
    texture.needsUpdate = true;
    if (this.linear) {
      this.mesh.rotation.y += delta * rotationSpeed;
    }
  };

  this.startAnimation = function () {
    if (this.hasStarted) return;
    this.rotationStartTime = Date.now();
    this.hasStarted = true;
    this.accelerating = true;

    const maxRotation = this.mesh.rotation.y + pi2;

    new TWEEN.Tween(this.mesh.rotation)
      .to({ y: maxRotation }, easingTime)
      .easing(TWEEN.Easing.Quadratic.In)
      .onComplete(() => this.startLinear())
      .start();
  };

  this.startLinear = function () {
    this.linear = true;
  };

  this.stopLinear = function () {
    this.linear = false;
    const angleMore = Math.PI / 10;
    const deltaEnd = this.mesh.rotation.y % (discret);
    const distance = pi2 - deltaEnd + angleMore;
    const endRotation = this.mesh.rotation.y + distance;

    const tween1 = new TWEEN.Tween(this.mesh.rotation)
      .to({ y: endRotation }, 2 * distance / rotationSpeed)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onComplete(() => {
        rotation.y = 0;
        rotation.start = this.mesh.rotation.y;
      });

    const time2 = angleMore / rotationSpeed;

    const tween2 = new TWEEN.Tween(rotation)
      .to({ y: angleMore }, 6 * time2)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onUpdate(() => {
        this.mesh.rotation.y = rotation.start - rotation.y;
      })
      .onComplete(() => {
        this.hasStarted = false;
      });

    tween1.chain(tween2);
    tween1.start();
  };

  this.onDocumentKeyDown = function (event) {
    if (event.key === 's') {
      this.startAnimation();
    }
    if (event.key === 'd') {
      this.stopLinear();
    }
    if (event.key === 'c') {
      texture = buildTexture.loadAndBuildTexture([1, 2, 3, 4], { partName });
      material.map = texture;
    }
  };
};

module.exports = Cylinder;
