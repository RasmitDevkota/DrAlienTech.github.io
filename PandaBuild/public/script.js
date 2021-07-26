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

const db = firebase.firestore();
db.enablePersistence();

const users = db.collection("users");

const storage = firebase.storage().ref();

const blueprints = storage.child("PandaBuild/blueprints");
const builds = storage.child("PandaBuild/builds");

// Networking

var clientId = "";
var roomId = "";

const socket = new WebSocket("wss://Panda.dralientech.repl.co");

socket.addEventListener("open", (event) => {
    console.log(`[Opened socket connection]`);

    if (window.location.toString().includes("game.html")) {
        var urlParams = new URLSearchParams(decodeURIComponent(window.location.search));

        clientId = urlParams.get('clientId');
        roomId = urlParams.get('roomId');

        joinGame();
    }
});

socket.addEventListener("error", (e) => {
    console.log(e);
});

socket.addEventListener("message", (event) => {
    console.log(`-> ${event.data}`);
});

window.onbeforeunload = function () {
    console.log("Leaving");

    if (roomId == "") {
        socket.close(3005, `leave-build ${roomId} ${clientId}`);
    }
};

function send(message) {
    if (socket.readyState == 1) {
        socket.send(message);

        console.log(`<- ${message}`);
    } else {
        console.log(`[Socket not ready]`);
    }
}

function createGame() {
    clientId = document.getElementById("usernameCreate").value;

    if (clientId.includes(" ")) {
        return alert("Sorry, username cannot contain spaces!");
    }

    send(`create-build ${clientId}`);

    socket.addEventListener("message", function createCallback(event) {
        const options = event.data.split(" ");

        if (options[0] == "create-build") {
            if (options[1] == "success") {
                roomId = options[2];

                socket.close(1000, `redirect-build ${roomId} ${clientId}`);

                window.location.href = `game.html?clientId=${clientId}&roomId=${roomId}`;
            } else {
                alert("Error creating room! Please refresh the page and try again!");
            }

            socket.removeEventListener("message", createCallback);
        }
    });
}

function findGame() {
    roomId = document.getElementById("code").value;
    clientId = document.getElementById("usernameJoin").value;

    if (clientId.includes(" ")) {
        return alert("Sorry, username cannot contain spaces!");
    }

    send(`find-build ${roomId}`);

    socket.addEventListener("message", function findCallback(event) {
        const options = event.data.split(" ");

        if (options[0] == "find-build") {
            if (options[1] == "success") {
                socket.close(1000, `redirect-build ${roomId} ${clientId}`);

                window.location = `game.html?clientId=${clientId}&roomId=${roomId}`;
            } else if (options[1] == "error") {
                switch (options[2]) {
                    case "not-found":
                        alert("Game not found! Make sure the game code is typed in correctly!");

                        break;
                    case "room-busy":
                        alert("Game is already full or in progress!");

                        break;
                    default:
                        alert("Error joining room! Please refresh the page and try again!");
                }
            } else {
                alert("Error joining room! Please refresh the page and try again!");
            }

            socket.findCallback("message", joinCallback);
        }
    });
}

function joinGame() {
    send(`join-build ${roomId} ${clientId}`);

    socket.addEventListener("message", function joinCallback(event) {
        const options = event.data.split(" ");

        if (options[0] == "join-build") {
            if (options[1] == "success") {
                console.log("Successfully joined game!");

                // Stuff!
            } else if (options[1] == "error") {
                switch (options[2]) {
                    case "not-found":
                        alert("Game not found! Make sure the game code is typed in correctly!");

                        break;
                    case "room-busy":
                        alert("Game is already full or in progress!");

                        break;
                    default:
                        alert("Error joining room! Please refresh the page and try again!");
                }
            } else {
                alert("Error joining room! Please refresh the page and try again!");
            }

            socket.removeEventListener("message", joinCallback);
        }
    });
}