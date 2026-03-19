const express = require("express")
const app = express();
const routes = require('./routes/index')
const cors = require('cors')
const cookieParser = require('cookie-parser');

//跨域
app.use(cors({
    origin: function (origin, callback) {
        const localhostRegex = /^http:\/\/localhost:\d+$/;
        if (!origin) return callback(null, true);
        if (localhostRegex.test(origin)) {
            callback(null, origin);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true  // 允许携带Cookie
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static('public/uploads'));
app.use(cookieParser());

app.use('/api', routes)

// Socket
const http = require('http');
const setupSocket = require('./socket');
const socketManager = require('./socket/socketManager')

const server = http.createServer(app);
const io = socketManager.init(server);
setupSocket(io);
server.listen(3300, () => console.log('Server running'));