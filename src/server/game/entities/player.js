const Entity = require(`./entity.js`);

const xssFilters = require(`xss-filters`);
const filter = require(`../../utils/filter.js`);

class Player extends Entity {
    constructor (name, x, z) {
        super(x, z);

        // Define the entity as a player.
        this.netType = 0;

        // Set the name of the player, and determine whether it is a logged in account.
        this.name = name ? filter.clean(xssFilters.inHTMLData(name)) : `user${Math.floor(Math.random() * 900) + 100}`;
        this.isLoggedIn = name !== undefined;

        // Security value for if the player is muted in chat.
        this.isMuted = false;

        // Security values for permissions.
        this.permissions = {
            gameDev: false,
            gameMod: false,

            siteAdmin: false,
            siteMod: false
        };
    }
}

module.exports = Player;
