require(`dotenv`).config();

const fs = require(`fs`);
const socketIO = require(`socket.io`);

// Configuration and utilities.
const config = require(`../../../config/config.js`);
const log = require(`../utils/log.js`);

// Transport protocols.
const http = require(`http`);
const https = require(`https`);

// Create the HTTP server for socket.io to hook into.
const server = config.mode === `prod`
    ? https.createServer({
        key: fs.readFileSync(`/etc/letsencrypt/live/${config.domain}/privkey.pem`),
        cert: fs.readFileSync(`/etc/letsencrypt/live/${config.domain}/fullchain.pem`),
        requestCert: false,
        rejectUnauthorized: false
    })
    : http.createServer();

// Create the socket.IO instance.
const io = socketIO(server, {
    cors: {
        origin: config.mode === `prod` ? `https://${config.domain}` : `http://localhost:8080`,
        methods: [`GET`, `POST`],
        credentials: true
    }
});

// Start the server.
server.listen(process.env.socketPort);
log(`green`, `Socket.IO has started on port ${process.env.socketPort}.`);

module.exports = io;
