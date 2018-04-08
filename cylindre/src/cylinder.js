"use strict";

const THREE = require('three');
const easing = require('js-easing-functions');

const TWEEN = require('@tweenjs/tween.js');

const time = 1000;
const maxRotation = 1;
const rotationSpeed = 2*maxRotation/time;

const cylinder = {

    state:{
        rotationStartTime: 0,
        rotationTargetAngle: 0,
        hasStarted: false,
        accelerating: false,
        rotationSpeed: 0,
        delta: 0,
    },

    mesh: null,

    initialize(scene, renderer){
        document.addEventListener("keyup", cylinder.onDocumentKeyDown, false);

    	var geometry = new THREE.CylinderGeometry( 1, 1, 1, 12 );
    	var loader = new THREE.TextureLoader();
    	var texture = loader.load( '../assets/texture1.png', () => {} );
    	var material = new THREE.MeshBasicMaterial( { map: texture } );
    	var mesh = new THREE.Mesh( geometry, material );
    	scene.add( mesh );
        cylinder.mesh = mesh;
    	return cylinder;
    },

    animate(delta){
        if (this.state.linear) {
            cylinder.mesh.rotation.y += delta * rotationSpeed;
        }

    },

    startAnimation(){
        if(cylinder.state.hasStarted)return;
        cylinder.state.rotationStartTime = Date.now();
        cylinder.state.hasStarted = true;
        cylinder.state.accelerating = true;

        var tween = new TWEEN.Tween(cylinder.mesh.rotation)
        .to({ y: maxRotation}, time)
        .easing(TWEEN.Easing.Quadratic.In)
        .onComplete(() => this.startLinear())
        .start();
    },
    stopAnimation(){
        cylinder.state.hasStarted = false;
        // cylinder.state.rotationTargetAngle = Math.PI/2;
        // cylinder.state.rotationTargetAngle = Math.PI/2;
    },
    startLinear() {
        this.state.linear = true;
    },
    onDocumentKeyDown(event) {
    	if(event.key == "s"){
    		cylinder.startAnimation();
    	}
    	if(event.key == "d"){
    		cylinder.stopAnimation();
    	}
    },
};

module.exports = cylinder;
