const core = require(`./core.js`);

const log = require(`../utils/log.js`);
log(`green`, `Server has started.`);

let offsetInterval = new Date();
setInterval(() => {
    core.doEntityTick((new Date() - offsetInterval) / 1e3);
    offsetInterval = new Date();
});
