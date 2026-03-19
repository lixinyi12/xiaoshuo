let ioInstance;
const init = (server) => {
    const { Server } = require('socket.io');
    ioInstance = new Server(server, {
        cors: {
            origin: function (origin, callback) {
                const localhostRegex = /^http:\/\/localhost:\d+$/;
                if (!origin) return callback(null, true);
                if (localhostRegex.test(origin)) {
                    callback(null, origin);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            credentials: true
        }
    });
    return ioInstance;
}
const getIo = () => {
    if (!ioInstance) {
        throw new Error('Socket.io未初始化');
    }
    return ioInstance;
}
module.exports = {
    init,
    getIo
}