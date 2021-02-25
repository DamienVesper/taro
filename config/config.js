require(`dotenv`).config();

const path = require(`path`);

module.exports = {
    mode: process.env.NODE_ENV,
    domain: process.env.NODE_ENV === `prod` ? `modd.io` : `localhost`,

    webfront: {
        port: process.env.NODE_ENV === `prod` ? 7777 : 8080,
        staticDir: path.resolve(__dirname, `../../client/assets`)
    }
};
