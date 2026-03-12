const SOCKET_METHOD = require('../../constants/socket')

module.exports = (io, socket) => {
    socket.on(SOCKET_METHOD.REVIEW_REJECT, (msg) => {
        console.log('被拒绝:', msg);
        io.emit(SOCKET_METHOD.REVIEW_REJECT, msg);
    });
    socket.on(SOCKET_METHOD.REVIEW_APPROVED, (msg) => {
        console.log('通过:', msg);
        io.emit(SOCKET_METHOD.REVIEW_APPROVED, msg);
    });
};