const fs = require("fs");

// Main
fs.readFile("./text.txt", (e, d) => {
    const text = d.toString().replace(/(,|\.|-)/g, "").split(" ");
    const skew = new Skew(text);

    console.log(skew.connections(1));
});

// Utilities
class Skew {
    nodes = [];
    connections = [];

    constructor(_nodes) {
        for (let node of _nodes) {
            this.nodes.push(new Node(node));
        }
    }

    connections(order) {
        if (this.connections[order].length == 0) {
            this.connections[order] = initializeRandomConnections(order);
        }

        return this.connections[order];
    }

    initializeRandomConnections(order) {
        var _connections = [];

        for (let node of nodes) {
            if (Math.random() > Math.random() - Math.random()) {
                _connections.concat(randomConnect(node, order));
            }
        }

        this.connections[order] = _connections;
    }

    randomConnect(node, order) {
        const nextNode = nodes[Math.floor(Math.random() * this.nodes.length)];

        if (order > 1) {
            return [new Connection(node, nextNode)].concat(randomConnect(nextNode, order--));
        } else {
            return [new Connection(node, nextNode)];
        }
    }
}

class Node {
    data;
    connections = [];

    constructor(_data) {
        this.data = _data;
    }

    connect(connection, order) {
        this.connections[order].push(connection);
    }
}

class Connection {
    nodes = [];

    constructor() {
        for (argument of arguments) {
            this.nodes.push(argument);
        }
    }
}