require(`dotenv`).config();

module.exports = {
    mode: process.env.NODE_ENV,
    domain: process.env.NODE_ENV === `prod` ? `modd.io` : `localhost`,
    port: process.env.NODE_ENV === `prod` ? 7777 : 8080
};
