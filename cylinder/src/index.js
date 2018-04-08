"use strict";

const THREE = require('three');
const cylinder = require("./cylinder");
const TWEEN = require('@tweenjs/tween.js');

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 5;

function initializeRenderer(scene){
	const renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	renderer.setClearColor("#FFFFFF");
	return renderer;
}

function initializeScene(scene, renderer){
	return cylinder.initialize(scene, renderer);
}

const renderer =initializeRenderer(scene);
const head = initializeScene(scene,renderer);

let lastFrame = Date.now();
var animate = function (time) {

	const now = Date.now()
	const delta = now - lastFrame;
	lastFrame = now;
	TWEEN.update(time);

	head.animate(delta);
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
};

animate();
