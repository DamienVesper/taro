const Entity = require(`./entity.js`);

const xssFilters = require(`xss-filters`);
const filter = require(`../../utils/filter.js`);

class Player extends Entity {
    constructor (name, x, z) {
        super(x, z);

        // Define the entity as a player.
        this.netType = 0;

        // Set the name of the player.
        this.name = filter.clean(xssFilters.inHTMLData(name));

        // Security value for if the player is muted in chat.
        this.isMuted = false;
    }
}

module.exports = Player;
