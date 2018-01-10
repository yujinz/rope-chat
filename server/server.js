var express = require('express');
var http = require('http')
var socketio = require('socket.io');
var mongojs = require('mongojs');

var ObjectID = mongojs.ObjectID;
var db = mongojs(process.env.MONGO_URL || 'mongodb://localhost:27017/local');
var app = express();
var server = http.Server(app);
var websocket = socketio(server);
server.listen(3001, () => console.log('listening on *:3001'));

// Mapping objects to easily map sockets and users.
var clients = {};
var users = {};

// When a client is connected.
websocket.on('connection', (socket) => {
  console.log('A client just joined on', socket.id);

  clients[socket.id] = socket;
  socket.on('userJoined', (userId) => onUserJoined(userId, socket));  
  socket.on('message', (message) => onMessageReceived(message, socket));
});

function onUserJoined(userId, socket) {
  try {
    // The userId is null for new users.
    if (!userId) {
      var user = db.collection('users').insert({}, (err, user) => {
        socket.emit('userJoined', user._id);
        users[socket.id] = user._id;
        //_sendExistingMessages(socket);
      });
    } else {
      users[socket.id] = userId;
      //_sendExistingMessages(socket);
    }
  } catch(err) {
    console.err(err);
  }
}

// When a user sends a message in the chatroom.
function onMessageReceived(message, senderSocket) {
  var userId = users[senderSocket.id];
  // Safety check.
  if (!userId) return;

  console.log('server R');
  _sendAndSaveMessage(message, senderSocket);
}

// Save the message to the db and send all sockets
// NOT: but the sender.
function _sendAndSaveMessage(message, socket, fromServer) {
  var messageData = {
    text: message.text,
    user: message.user,
    createdAt: new Date(message.createdAt),
    channel: message.channel
  };

  db.collection('messages').insert(messageData, (err, message) => {
    websocket.emit('message', [message]);
    console.log('server S');
  });
}
