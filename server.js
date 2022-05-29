const { Socket } = require('dgram');
const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});
const io = socket(server);

const users = [];
const messages = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);

  socket.on('join', (name) => { 
    console.log(`${name} joined`);
    users.push({name, id: socket.id});
    socket.broadcast.emit('message', );
    socket.broadcast.emit('message', { 
      author: 'Chat Bot', 
      content: `<i>${name} has joined the conversation!</i>` 
    });
  });
  
  socket.on('message', (message) => { 
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });

  socket.on('disconnect', () => { 
    console.log('Oh, socket ' + socket.id + ' has left');
    const userIndex = users.findIndex(user => user.id === socket.id);
    const userName = users[userIndex] === 'undefined' ? '' : users[userIndex].name;
    users.splice(userIndex, 1);
    socket.broadcast.emit('message', { 
      author: 'Chat Bot', 
      content: `<i>${userName} has left the conversation... :(</i>` 
    });
  });

  console.log('I\'ve added a listener on message and disconnect events \n');
});
