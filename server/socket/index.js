const cookie = require('cookie');
const { verifyToken } = require('../utils/token');

module.exports = (io) => {
    io.use((socket, next) => {
        const cookies = socket.handshake.headers.cookie;
        if (!cookies) {
            return next(new Error('未提供Cookie'))
        }

        const parsedCookies = cookie.parse(cookies);
        const token = parsedCookies.token;

        if (!token) {
            return next(new Error('未找到token'));
        }

        try {
            const { userId } = verifyToken(token);
            socket.userId = userId;
            next();
        } catch (error) {
            return next(error)
        }
    })

    io.on('connection', (socket) => {
        console.log('新连接:', socket.id);

        if (socket.userId) {
            socket.join(`user:${socket.userId}`);
        }

        // 引入各个事件处理器
        require('./handlers/application')(io, socket);

        socket.on('disconnect', (reason) => {
            console.log('断开连接:', socket.id, '原因：', reason);
        });

        socket.on('error', (err) => {
            console.log('Socket错误：', err)
        })
    });
};