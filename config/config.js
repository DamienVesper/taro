require(`dotenv`).config();
const pjson = require(`../package.json`);

const gameConfig = require(`./partials/webfront.js`);
const wsConfig = require(`./partials/websocket.js`);
const webfrontConfig = require(`./partials/webfront.js`);

module.exports = {
    mode: process.env.NODE_ENV,
    domain: process.env.NODE_ENV === `prod` ? `modd.io` : `localhost`,

    webfront: webfrontConfig,
    ws: wsConfig,
    game: gameConfig,

    author: pjson.author,
    version: pjson.version
};
