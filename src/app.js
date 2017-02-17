const http = require('http');
const socketio = require('socket.io');

const fs = require('fs');

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

const square = {
  lastUpdate: new Date().getDate(),
  x: 0,
  y: 0,
  width: 100,
  height:100
}

const handler = (req, res) => {
  fs.readFile(`${__dirname}/../client/index.html`, (err, data) => {
    if(err){
      throw err;
    }
    
    res.writeHead(200);
    res.end(data);
  });
};

const app = http.createServer(handler);
const io = socketio(app);

app.listen(PORT);

io.on('connect', (socket) => {
  socket.join('lobby');
  
  socket.on('movementUpdate', (data) => {
    square.x += data.xUpdate;
    square.y += data.yUpdate;
    square.lastUpdate = new Date().getDate();
    
    io.sockets.in('lobby').emit('updatedMovement', square);
  });
  
  socket.on('disconnect', (data) => {
    socket.leave('lobby');
  });
});

console.log(`listening on ${PORT}`);