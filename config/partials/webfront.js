require(`dotenv`).config();
const path = require(`path`);

module.exports = {
    port: process.env.NODE_ENV === `prod` ? 7777 : 8080,
    staticDir: path.resolve(__dirname, `../../client/assets`)
};
