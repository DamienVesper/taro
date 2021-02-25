require(`dotenv`).config();

// Configuration.
const config = require(`../../../config/config.js`);
const path = require(`path`);
const fs = require(`fs`);

// Utilities
const log = require(`../utils/log.js`);
const logASCII = require(`../utils/logASCII.js`);
const logHeader = require(`../utils/logHeader.js`);

// HTTP / HTTPS transport protocols.
const http = require(`http`);
const https = require(`https`);

// Express app.
const express = require(`express`);
const app = express();

// Express middleware.
const bodyParser = require(`body-parser`);
const compression = require(`compression`);
const helmet = require(`helmet`);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(bodyParser.json({ limit: `50mb` }));
app.use(bodyParser.urlencoded({
    limit: `50mb`,
    extended: true
}));

// Set view engine.
app.set(`views`, path.resolve(__dirname, `./views`));
app.set(`view engine`, `ejs`);

// Serve the static directory.
app.use(`/`, express.static(config.webfront.staticDir));

// Use routes.
const indexRouter = require(`./routes/index.js`);
app.use(`/`, indexRouter);

// Create the webfront.
const server = config.mode === `dev`
    ? http.createServer(app)
    : https.createServer({
        key: fs.readFileSync(config.ssl.keyPath),
        cert: fs.readFileSync(config.ssl.certPath),
        requestCert: false,
        rejectUnauthorized: false
    }, app);

logASCII();
logHeader();

// Bind the webfront to defined port.
server.listen(config.webfront.port);
log(`green`, `Webfront bound to port ${config.webfront.port}.`);

// Export the local server for socket.io.
module.exports = {
    server,
    app
};
