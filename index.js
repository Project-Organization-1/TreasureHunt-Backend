const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./routes/user");
const http = require('http');
const socketio = require('socket.io');

const App = express();
const server = http.createServer(App);

dotenv.config();
const uri = process.env.ATLAS_URI;

var cors = require('cors');
const { group } = require("console");

App.use(cors())

mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
    // useFindAndModify: false
})
    .then(() => {
        console.log("connected to database");
    })
    .catch(err => {
        console.log("error!!");
        console.log(err);
    });

App.use(express.json());

App.use(cors(
    {
        origin: "*", // allow to server to accept request from different origin
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true // allow session cookie from browser to pass through
    }
));

App.use('/user', userRouter);

const io = socketio(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});

io.on('connection', socket => {
    const email = socket.handshake.query.loggedUser;
    const groupId = socket.handshake.query.groupId;

    // Immediately Join room with group id
    socket.join(groupId);
    console.log(`${email} joined group ${groupId}`);
    socket.emit('you-joined-room', groupId, io.of('/').adapter.rooms.get(groupId) ? io.of('/').adapter.rooms.get(groupId).size : 1)
    const set = io.of('/').adapter.rooms;
    console.log(set)

    socket.to(groupId).emit('member-joined-room', email, groupId, socket.id, io.of('/').adapter.rooms.get(groupId) ? io.of('/').adapter.rooms.get(groupId).size : 1);

    socket.on('disconnect', () => {
        socket.leave(groupId)
        io.in(groupId).emit('room-left', email, groupId, io.of('/').adapter.rooms.get(groupId) ? io.of('/').adapter.rooms.get(groupId).size : 1);
        console.log(`Disconnected ${socket.id} with email ${email}`);
        socket.broadcast.to(groupId).emit('member-disconnected', email, io.of('/').adapter.rooms.get(groupId) ? io.of('/').adapter.rooms.get(groupId).size : 1);
    })

})

server.listen(5000, () => {
    console.log("Hello World");
});

module.exports = App;