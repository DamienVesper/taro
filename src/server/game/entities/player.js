const Entity = require(`./entity.js`);

const xssFilters = require(`xss-filters`);
const filter = require(`../../utils/filter.js`);

class Player extends Entity {
    constructor (name, x, y) {
        super(x, y);

        // Define the entity as a player.
        this.netType = 0;

        // Set the name of the player, and determine whether it is a logged in account.
        this.name = name ? filter.clean(xssFilters.inHTMLData(name.substr(0, 12))) : `user${Math.floor(Math.random() * 900) + 100}`;
        this.isLoggedIn = name !== undefined;

        // Security values.
        this.isMuted = false;
        this.lastMoved = new Date();

        this.permissions = {
            gameDev: false,
            gameMod: false,

            siteAdmin: false,
            siteMod: false
        };
    }
}

module.exports = Player;
