const express = require("express")
const app = express();
const routes = require('./routes/index')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const setupCollaborationServer = require('./services/collaboration');

// 跨域
app.use(cors({
    origin: function (origin, callback) {
        const localhostRegex = /^http:\/\/localhost:\d+$/;
        if (!origin) return callback(null, true);
        if (localhostRegex.test(origin)) {
            callback(null, origin);
        } else {
            callback(null, false);
        }
    },
    credentials: true  // 允许携带Cookie
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 文件上传
app.use('/uploads', express.static('public/uploads'));

// Cookie
app.use(cookieParser());

// 路由
app.use('/api', routes)

// 协同编辑 WebSocket 服务
setupCollaborationServer(app);

// Socket
const http = require('http');
const setupSocket = require('./socket');
const socketManager = require('./socket/socketManager')

const server = http.createServer(app);
const io = socketManager.init(server);
setupSocket(io);
server.listen(3300, () => console.log('Server running'));