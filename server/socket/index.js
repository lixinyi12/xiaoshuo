module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('新连接:', socket.id);

        // 引入各个事件处理器
        require('./handlers/application')(io, socket);

        socket.on('disconnect', () => {
            console.log('断开连接:', socket.id);
        });
    });
};