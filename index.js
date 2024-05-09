const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let webSockets = {}

wss.on('connection', function (webSocket, req) {
    var userID = req.url.substring(1)
    webSockets[userID] = webSocket
    console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(webSockets))

    webSocket.on('message', function(message) {
      console.log('received from ' + userID + ': ' + message)
      var messageArray = JSON.parse(message)
      let splitted_id = messageArray[0]
      let index = ""
      for(let items in webSockets) {
        if(items.split("-")[5] == splitted_id) {
            index = items
        }
      }
      var toUserWebSocket = webSockets[index]
      if (toUserWebSocket != "") {
        console.log('sent to ' + index + ': ' + JSON.stringify(messageArray))
        messageArray[0] = index
        toUserWebSocket.send(JSON.stringify(messageArray))
      }
    })

    webSocket.on('close', () => {
        delete webSockets[userID]
        console.log('connection of ' + userID + ' has been disconnected')
    });
})

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});