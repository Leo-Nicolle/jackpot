'use-strict';

const THREE = require('three');

const TWEEN = require('@tweenjs/tween.js');

const easingTime = 2000;
const pi2 = 2 * Math.PI;
const rotationSpeed = 2 * pi2 / easingTime;
const discret = pi2 / 4;

const rotation = { y: 0, start: 0 };

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
    const loader = new THREE.TextureLoader();
    const texture = loader.load('../assets/texture1.png', () => {});
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    cylinder.mesh = mesh;
    return cylinder;
  },

  animate(delta) {
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

    console.log('ici', distance / rotationSpeed, distance, rotationSpeed);
    const tween1 = new TWEEN.Tween(cylinder.mesh.rotation)
      .to({ y: endRotation }, 2 * distance / rotationSpeed)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onComplete(() => {
        rotation.y = 0;
        rotation.start = cylinder.mesh.rotation.y;
      });

    const time2 = angleMore / rotationSpeed;
    console.log('ici2', time2, angleMore, rotationSpeed);

    const tween2 = new TWEEN.Tween(rotation)
      .to({ y: angleMore }, 6 * time2)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onUpdate(() => {
        cylinder.mesh.rotation.y = rotation.start - rotation.y;
      })
      .onComplete(() => {
        console.log('change', cylinder.mesh.rotation.y / Math.PI);
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
  },

};

module.exports = cylinder;
