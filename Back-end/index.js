'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');


const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());

const socketIO = require('socket.io');
const server = http.createServer(app);
const io = socketIO(server, {
    transports: ['websocket', 'polling'],
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT']
    }
})
const users=[]

io.on('connection', (socket) => {
    console.log('User is connected');
    console.log(socket.id);
    users.push(socket.id)


    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
      });
    
      socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
      });
    
     

    socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} disconnected!`);
    })
})

app.get('/', (req, res) => {
    res.send('Hello World')
})


// module.exports = { app, io };

server.listen(PORT, () => {
    console.log(`Server up and running on port ${PORT}`)
})
