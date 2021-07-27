// Imports

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js';
import { OrbitControls } from './OrbitControls.js';

// Waiting

window.loadWaitingUI = (text) => {
    document.getElementById("drawing").style.display = "none";
    document.getElementById("saveBlueprint").style.display = "none";
    document.getElementById("building").style.display = "none";
    document.getElementById("saveBuild").style.display = "none";
    document.getElementById("reference").style.display = "none";

    document.getElementById("waitingCard").innerHTML = text;
    document.getElementById("waitingCard").style.display = "";
}

// Drawing

var drawCanvas;
var context;

if (window.location.toString().includes("game.html")) {
    drawCanvas = document.getElementById("drawCanvas");
    context = drawCanvas.getContext("2d");

    drawCanvas.width = window.innerWidth * 0.45;
    drawCanvas.height = window.innerHeight * 0.8;
    drawCanvas.style.marginTop = window.innerHeight * 0.1;

    context.fillStyle = "#0058bc";
    context.fillRect(0, 0, drawCanvas.width, drawCanvas.height);
}

var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();

var paint;

window.loadDrawingUI = (referenceName) => {
    document.getElementById("waitingCard").style.display = "none";

    document.getElementById("drawing").style.display = "";
    document.getElementById("saveBlueprint").style.display = "";

    document.getElementById("saveBlueprint").addEventListener("click", () => {
        saveBlueprint();
    });

    document.getElementById("reference").style.display = "";

    init("referenceCanvas", "reference");
    render();
    animate();

    builds.child(`${referenceName}.json`).getDownloadURL().then((url) => {
        fetch(url).then(res => res.json()).then(data => {
            var loader = new THREE.ObjectLoader();
            var object = loader.parse(data);

            console.log(object);

            console.log("owo");

            scene.add(object);
        });
    });

    $("#drawCanvas").mousemove(function (e) {
        if (paint) {
            addClick(e.offsetX, e.offsetY, true);

            redraw();
        }
    });

    $("#drawCanvas").mousedown(function (e) {
        paint = true;

        addClick(e.offsetX, e.offsetY);

        redraw();
    });

    $("#drawCanvas").mouseup(function (e) {
        paint = false;
    });
};

function addClick(x, y, dragging) {
    clickX.push(x);
    clickY.push(y);

    clickDrag.push(dragging);
}

function redraw(brush = {
    color: "#ffffff",
    width: 5,
}) {
    context.strokeStyle = brush.color;

    context.lineJoin = "round";

    context.lineWidth = brush.width;

    for (var i = 0; i < clickX.length; i++) {
        context.beginPath();

        if (clickDrag[i] && i) {
            context.moveTo(clickX[i - 1], clickY[i - 1]);
        } else {
            context.moveTo(clickX[i] - 1, clickY[i]);
        }

        context.lineTo(clickX[i], clickY[i]);

        context.closePath();

        context.stroke();
    }
}

function saveBlueprint() {
    const blueprintName = new Date().getTime();

    drawCanvas.toBlob((blob) => {
        blueprints.child(`${blueprintName}.png`).put(blob).then((_) => {
            console.log("Saved blueprint!");

            send(`message-build ${roomId} ${clientId} submit-blueprint ${blueprintName}`);

            loadWaitingUI("Great! Now wait for the builder to recreate the reference object using your blueprint!");
        });
    });
}

// Building

var buildCanvas;
var width = window.innerWidth * 0.45;
var height = window.innerHeight * 0.8;
var marginTop = window.innerHeight * 0.1;

var initialized = false;

var scene;
var camera;
var controls;
var renderer;
var plane;
var pointer;
var raycaster;

const objects = [];

const cubeSize = 50;

var cubeGeo;
var cubeMaterial;

var isShiftDown;

window.loadBuildingUI = (blueprintName) => {
    document.getElementById("waitingCard").style.display = "none";

    document.getElementById("building").style.display = "";
    document.getElementById("saveBuild").style.display = "";

    document.getElementById("reference").style.display = "";

    blueprints.child(`${blueprintName}.png`).getDownloadURL().then((url) => {
        document.getElementById("reference").innerHTML = `
            <img id="referenceImage" src="${url}">
        `;
    });

    init();
    render();
    animate();

    document.addEventListener('pointerdown', (event) => {
        if (initialized) {
            if (event.clientX > buildCanvas.offsetLeft && event.clientY > buildCanvas.offsetTop) {
                pointer.set((event.offsetX / width) * 2 - 1, - (event.offsetY / height) * 2 + 1);

                raycaster.setFromCamera(pointer, camera);

                var intersects = raycaster.intersectObjects(objects);

                if (intersects.length > 0) {
                    const intersect = intersects[0];

                    if (isShiftDown) {
                        if (intersect.object !== plane) {
                            scene.remove(intersect.object);

                            objects.splice(objects.indexOf(intersect.object), 1);
                        }
                    } else {
                        var voxel = new THREE.Mesh(cubeGeo, cubeMaterial);

                        voxel.position.copy(intersect.point).add(intersect.face.normal);
                        voxel.position.divideScalar(cubeSize).floor().multiplyScalar(cubeSize).addScalar(cubeSize / 2);

                        scene.add(voxel);

                        objects.push(voxel);
                    }

                    render();
                }
            }
        }
    });

    document.addEventListener('keydown', (event) => {
        switch (event.keyCode) {
            case 16:
                isShiftDown = true;

                break;
        }
    });

    document.addEventListener('keyup', (event) => {
        switch (event.keyCode) {
            case 16:
                isShiftDown = false;

                break;
        }
    });

    document.getElementById("saveBuild").addEventListener("click", () => {
        saveBuild();
    });
}

function init(rendererId = "buildCanvas", parentDiv = "building") {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);

    cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    cubeMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('block.png') });

    scene.add(new THREE.GridHelper(1000, 20));

    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();

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

    renderer.domElement.id = rendererId;

    renderer.domElement.style.width = width;
    renderer.domElement.style.height = height;
    renderer.domElement.style.marginTop = marginTop;

    document.getElementById(parentDiv).appendChild(renderer.domElement);

    buildCanvas = document.getElementById(rendererId);

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

function saveBuild() {
    const buildName = new Date().getTime();

    builds.child(`${buildName}.json`).put(new Blob([JSON.stringify(scene.toJSON())], { type: "application/json" })).then((_) => {
        console.log("Saved build!");

        send(`message-build ${roomId} ${clientId} submit-build ${buildName}`);
    });
}

// Networking

socket.addEventListener("message", function finishCallback(event) {
    const options = event.data.split(" ");

    if (options[0] == "message-build") {
        if (options[1] == "game-over") {
            socket.close(1000, `redirect-build ${roomId} ${clientId}`);

            window.location.href = `results.html?clientId=${clientId}&roomId=${roomId}`;

            socket.removeEventListener("message", finishCallback);
        }
    }
});