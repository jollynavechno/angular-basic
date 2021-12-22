const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        methods: ['GET', 'POST']
    }
});

let joiningRoom;

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, PATCH, PUT, POST, DELETE, OPTIONS");
    next();
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/src/index.html");
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('join room', (room) => {
        socket.join(room);
        joiningRoom = room;
    });

    socket.on('my message', (msg) => {
        io.to(joiningRoom).emit('add message', msg);
    });
});

http.listen(process.env.PORT || 4000, () => {
    console.log("listening on *:4000");
});