const { Server } = require('@hocuspocus/server');
const { ExpressReceiver } = require('@hocuspocus/extension-express');
const auth = require('./auth');
const { onLoadDocument, onStoreDocument } = require('./storage');

function setupCollaborationServer(app) {
    const server = Server.configure({
        extensions: [
            new ExpressReceiver({ app }),
        ],
        async onAuthenticate(data) {
            return auth(data);
        },
        async onLoadDocument(data) {
            return onLoadDocument(data);
        },
        async onStoreDocument(data) {
            await onStoreDocument(data);
        },
    });

    server.listen();
}

module.exports = setupCollaborationServer;