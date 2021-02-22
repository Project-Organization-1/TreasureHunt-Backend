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

var cors = require('cors')

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
        origin: '*',
    }
});

//const io_namespace = io.of('/foobar');

io.on('connection', (socket) => {
    // console.log("User connected" + socket.handshake.query.loggedUser);

    // console.log(`Count = ${socket.conn.server.clientsCount}`);

    socket.on('join-room', data => {
        console.log('room join');
        console.log(data);
        socket.join(data.room);
        const set = io.of('/').adapter.rooms;
        console.log(set)
        const size = io.of('/').adapter.rooms.get(data.room).size;
        console.log(size);
        io.emit('set-count', size)
    });

    io.of('/').adapter.on('leave-room', (data) => {
        try {
            console.log("here... data is " + data)
            if (io.of('/').adapter.rooms.get(data.room)) {
                socket.leave(data.room);
                console.log(`${data.room} left`)
                io.emit('set-count', size)
            }
        } catch (e) {
            console.log('[error]', 'leave room :', e);
            socket.emit('error', 'couldnt perform requested action');
        }

    });

    // socket.on('count', data => {
    //     console.log(data.room);
    //     socket.broadcast.emit('set-count', data)
    // });



    socket.on('disconnect', () => {
        console.log('user connected ? ' + socket.connected);
    })

    // console.log(socket.server.engine.clientsCount);
    // console.log(io.engine.clientsCount);
    // console.log(io_namespace.server.engine.clientsCount);
    // console.log(socket.client.conn.emit.length)
})

server.listen(5000, () => {
    console.log("Hello World");
});

module.exports = App;