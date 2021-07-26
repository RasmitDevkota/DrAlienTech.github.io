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

// firebase.analytics();

const db = firebase.firestore();
db.enablePersistence();

const users = db.collection("users");

const storage = firebase.storage().ref();

const blueprints = storage.child("PandaBuild/blueprints");
const builds = storage.child("PandaBuild/builds");

function createGame() {
    
}

function joinGame() {

}