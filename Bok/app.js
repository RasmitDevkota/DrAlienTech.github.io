const fs = require("fs");
const { connect } = require("node:http2");

// Main
const text = fs.readFile("./text.txt").replace(/(,|\.|-)/g, "").split(" ");

const connectionSpace = ConnectionSpace(text);

// Utilities
class ConnectionSpace {
    nodes = [];
    connections = [];

    constructor(_nodes) {
        for (node in _nodes) {
            this.nodes.push(Node(node));
        }
    }

    get connections(order) {
        if (this.connections[order].length == 0) {
            this.connections[order] = initializeRandomConnections(order);
        }

        return this.connections[order];
    }

    initializeRandomConnections(order) {
        var _connections = [];

        for (node in nodes) {
            if (Math.random() > Math.random()) {
                _connections.concat(connect(node, order));
            }
        }

        this.connections[order] = _connections;
    }

    connect(node, order) {
        const nextNode = nodes[Math.floor(Math.random() * this.nodes.length)];

        if (order > 1) {
            return [Connection(node, nextNode)].concat(connect(nextNode, order--));
        } else {
            return [Connection(node, nextNode)];
        }
    }
}

class Node {
    data;

    constructor(_data) {
        this.data = _data;
    }
}

class Connection {
    nodes = [];

    constructor()
}