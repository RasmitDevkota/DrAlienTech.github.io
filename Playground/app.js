const firebase = require("firebase");
require("firebase/storage");
const fetch = require('node-fetch');
const _ = require('lodash');

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

const storage = firebase.storage().ref();

const THRESHOLD = 0.1;

class PointCloud {
    constructor(_points) {
        this.points = _points;
    }

    size() {
        return this.points.length;
    }

    shift(b) {
        this.points = this.points.map((a) => a.shift(b));

        return this.points;
    }

    scale(factor) {
        this.points = this.points.map((a) => a.scale(factor));

        return this.points;
    }

    mean() {
        return this.points.reduce((a, b) => a.shift(b)).scale(1 / this.points.length);
    }

    round() {
        this.points = this.points.map((a) => a.scale(2).round().scale(1/2));

        return this.points;
    }

    contains(b) {
        return this.filter((a) => a.distance(b) < THRESHOLD).length > 0;
    }

    find(b) {
        return this.filter((a) => a.distance(b) < THRESHOLD);
    }

    nearest(c) {
        return this.points.sort((a, b) => a.distance(c) - b.distance(c));
    }
}

class Point {
    constructor(_coords) {
        this.coords = _coords;
    }

    shift(point) {
        this.coords = [this.coords[0] + point.coords[0], this.coords[1] + point.coords[1], this.coords[2] + point.coords[2]];

        return this;
    }

    scale(factor) {
        this.coords = [this.coords[0] * factor, this.coords[1] * factor, this.coords[2] * factor];

        return this;
    }

    distance(b) {
        return Math.sqrt((b.coords[0] - this.coords[0]) ** 2 + (b.coords[1] - this.coords[1]) ** 2 + (b.coords[2] - this.coords[2]) ** 2);
    }

    sum() {
        return this.coords.reduce((a, b) => a + b);
    }

    round() {
        this.coords = [Math.round(this.coords[0]), Math.round(this.coords[1]), Math.round(this.coords[2])]

        return this;
    }
}

async function grade(build, correct, room) {
    var X, Y;

    storage.child(`PandaBuild/builds/${build}.json`).getDownloadURL().then((urlB) => {
        fetch(urlB).then(res => res.json()).then(rawDataB => {
            X = new PointCloud(rawDataB["object"]["children"].filter(object => object["type"] == "Mesh").map(object => new Point(object.matrix.slice(12, 15))));

            storage.child(`PandaBuild/builds/${correct}.json`).getDownloadURL().then((urlC) => {
                fetch(urlC).then(res => res.json()).then(rawDataC => {
                    Y = new PointCloud(rawDataC["object"]["children"].filter(object => object["type"] == "Mesh").map(object => new Point(object.matrix.slice(12, 15))));

                    var score = 0;

                    if (X.size() < Y.size()) {
                        score = grade_impl(X, Y) / grade_impl(Y, Y);
                    } else {
                        score = grade_impl(Y, X) / grade_impl(X, X);
                    }

                    console.log(score);

                    room.broadcast(score);
                });
            });
        });
    });
}

function grade_impl(B, C) {
    // 0. Normallize data
    B.scale(1 / 50);

    C.scale(1 / 50);

    // 1. Get the list of vertices C for the correct build and the list
    // of vertices B for the one the user built. To do this, convert each
    // cube into a vertex whose position is at its center. Shift these
    // vertices such that their mean is the origin. Sort such that they are
    // in order of distance from the origin.

    var originalMeanB = B.mean();
    B.shift(originalMeanB.scale(-1 / 2));

    B.points = B.nearest(new Point([0, 0, 0]));

    var originalMeanC = C.mean();
    C.shift(originalMeanC.scale(-1 / 2));

    C.points = C.nearest(new Point([0, 0, 0]));

    // Optional: If you want to round
    // B.scale(2);
    // B.round();
    // B.scale(1/2);

    var neighborGroups = new Array();

    // For all vertices in B:
    for (var p in B.points) {
        var point = B.points[p];

        // 2. Find up to the k nearest neighbors in C (k > 0)
        const k = 1;

        var kNN = _.cloneDeep(C.nearest(point)).slice(0, k);

        // 3. For i from 0 to k, inclusive
        for (var n in kNN) {
            var candidates = _.cloneDeep(C.points);
            var neighbors = new Array();

            var averageDistance = 0;

            // 4. Pair the current B vertex with the k-th nearest neighbor in C
            var neighbor = kNN[n];
            neighbors.push(neighbor);

            candidates.splice(candidates.indexOf(neighbor), 1);

            averageDistance += point.distance(neighbor);

            // 5. Find the unique nearest neighbor in C of all other vertices in B
            for (var q in B.points) {
                if (p != q) {
                    var qoint = B.points[q];

                    var qlosest = candidates.sort((a, b) => a.distance(qoint) - b.distance(qoint))[0];
                    neighbors.push(qlosest);

                    candidates.splice(candidates.indexOf(qlosest), 1);

                    averageDistance += qoint.distance(qlosest);
                }
            }

            // 6. Calculate the average distance of all these unique pairs and push to a collection with the neighbor pairs
            averageDistance /= B.size();

            neighborGroups.push({
                neighbors: neighbors,
                averageDistance: averageDistance
            });
        }
    }

    // 7. Calculate final score by picking neighbor pair group with lowest average difference, where the score is calculated as 100 times 1 minus the average difference.
    neighborGroups.sort((a, b) => a.averageDistance - B.averageDistance);

    return Math.max(0, Math.floor(100 * (1 - neighborGroups[0].averageDistance)));
}

grade("1627336098268", "1627336172491");