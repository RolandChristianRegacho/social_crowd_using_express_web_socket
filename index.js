const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const { v4: uuidv4 } = require('uuid');

wss.on('connection', (ws) => {
    let id = uuidv4();
    console.log(`Client ${id} connected`);

    ws.on('connect', (id) => {
        ws.send(id)
    })

    ws.emit('connect', id)

    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        ws.send(`You sent: ${message}`);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});