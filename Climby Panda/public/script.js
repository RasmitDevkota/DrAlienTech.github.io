firebase.initializeApp({
    apiKey: "AIzaSyBVT22t-x2H76119AHG8SgPU0_A0U-N1uA",
    authDomain: "my-scrap-project.firebaseapp.com",
    databaseURL: "https://my-scrap-project.firebaseio.com",
    projectId: "my-scrap-project",
    storageBucket: "my-scrap-project.appspot.com",
    messagingSenderId: "334998588870",
    appId: "1:334998588870:web:fd80d1fe0d8237ccc536c7",
    measurementId: "G-S35B290G0V"
});

firebase.analytics();

var db = firebase.firestore();
db.enablePersistence();

const users = db.collection("users");

// Client-side Functionality

var bambooCount = 0;

function game() {
    const container = document.getElementById("bamboo-container");

    setInterval(() => {

    }, 500);
}

function addBamboo(left, top) {
    container.innerHTML += `
        <img class="bamboo" id="bamboo${bambooCount}" src="bamboo.png">
    `;

    bambooCount++;

    const bamboo = document.getElementById(`bamboo${bambooCount}`);

    bamboo.clientLeft = left;
    bamboo.clientTop = top;

    return bamboo;
}

// Server-side Communication

var clientId = Math.floor(Math.random() * 999 + 1);
var username = `Panda ${clientId}`;

var roomId = 0;
var isHost = false;

const socket = new WebSocket("wss://Climby-Panda.dralientech.repl.co");

socket.addEventListener("open", (event) => {
    console.log(`[Opened socket connection]`);
});

socket.addEventListener("error", (e) => {
    console.log(e);
});

socket.addEventListener("message", (event) => {
    console.log(event.data);

    console.log(`-> ${event.data}<br>`);
});

window.onbeforeunload = function () {
    socket.close(1005, servername);
};

function send(message) {
    if (socket.readyState == 1) {
        socket.send(message);

        console.log(`<- ${message}`);
    } else {
        console.log(`[Socket not ready]`);
    }
}

function sendGameAction(data) {
    if (roomId != 0) {
        send(`data ${roomId} ${clientId} ${data}`);
    }
}