// Imports

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js';
import { OrbitControls } from './OrbitControls.js';

// Build Results

var width = window.innerWidth * 0.3;
var height = window.innerWidth * 0.3;
var marginTop = window.innerHeight * 0.1;

var initialized = false;

var scene;
var camera;
var controls;
var renderer;
var plane;

const objects = [];

init();
render();
animate();

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);

    scene.add(new THREE.GridHelper(1000, 20));

    var geometry = new THREE.PlaneGeometry(1000, 1000);
    geometry.rotateX(- Math.PI / 2);

    plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ visible: false }));
    scene.add(plane);

    objects.push(plane);

    var ambientLight = new THREE.AmbientLight(0x606060);
    scene.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 0.75, 0.5).normalize();
    scene.add(directionalLight);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    renderer.domElement.id = "buildResult";

    renderer.domElement.style.width = width;
    renderer.domElement.style.height = height;
    renderer.domElement.style.marginTop = marginTop;

    document.getElementById("buildingResults").appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);

    camera.position.set(500, 800, 1300);
    camera.lookAt(0, 0, 0);

    controls.update();

    initialized = true;
}

function render() {
    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    if (initialized) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    }
});

window.loadScene = (data) => {
    var loader = new THREE.ObjectLoader();
    var object = loader.parse(data);

    scene.add(object);
}