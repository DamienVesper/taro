require(`dotenv`).config();
const path = require(`path`);

const Webpack = require(`webpack`);
const ClosurePlugin = require(`closure-webpack-plugin`);

module.exports = {
    mode: process.env.NODE_ENV === `prod` ? `production` : `development`,
    entry: path.resolve(__dirname, `./src/client/scripts/main.js`),
    output: {
        path: path.resolve(__dirname, `./src/client/scripts`),
        filename: `client.min.js`
    },
    plugins: [new Webpack.IgnorePlugin(/node_modules/)],
    optimization: {
        minimizer: [new ClosurePlugin({ mode: `STANDARD` })]
    },
    target: `web`
};
