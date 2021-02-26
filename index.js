require(`dotenv`).config();
const config = require(`./config/config.js`);

// Log errors.
const log = require(`./src/server/utils/log.js`);
process.on(`uncaughtException`, e => {
    log(`red`, e.stack);

    // If running in development, kill the server (keepalive if in production).
    if (config.mode === `dev`) process.exit(0);
});

// Start and bind the webfront.
require(`./src/server/webfront/index.js`);
