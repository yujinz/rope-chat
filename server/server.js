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
  socket.on('user:join', (userId) => onUserJoined(userId, socket));  
  socket.on('message:new', (message) => onMessageReceived(message, socket));
  socket.on('message:fetch', (channelId) => sendExistingMessages(channelId, socket)); 
  socket.on('user:set-name', (user) => setUsername(user, socket)); 
  socket.on('user:get-all', () => getAllUSers(socket));
});

function onUserJoined(userId, socket) {
  try {
    // The userId is null for new users.
    if (!userId) {
      db.collection('users').insert({ name: null }, (err, user) => {
        socket.emit('user:new', user._id);
        users[socket.id] = user._id;
      });
    } else {
      users[socket.id] = userId;
      //TODO: check exist
    }
  } catch(err) {
    console.error(err);
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
// TODO: but the sender.
function _sendAndSaveMessage(message, socket, fromServer) {
  var messageData = {
    text: message.text,
    user: message.user,
    createdAt: new Date(message.createdAt),
    channel: message.channel,
    thread: message.thread
  };

  db.collection('messages').insert(messageData, (err, message) => {
    websocket.emit('message:concat', [message]);
    console.log('server S');
  });
}

function sendExistingMessages(channelId, socket) {
  var messages = db.collection('messages')
    .find({ channel: channelId })
    .sort({ createdAt: 1 })
    .toArray((err, messages) => {
      if (!messages.length) return;
      socket.emit('message:concat', messages);
    });
}

function setUsername(user) {
  const userId = ObjectID(user._id);
  db.collection('users').update(
    {_id: userId},
    {$set: {name: user.name}}
  );  
  websocket.emit('user:concat', user);
}

function getAllUSers(socket) {
  var usersArr = db.collection('users').find({})
  .toArray((err, usersArr) => {
      socket.emit('user:get-all', usersArr);
    });
}
