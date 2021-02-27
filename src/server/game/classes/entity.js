const { entities } = require(`../entities.js`);

class Entity {
    constructor (x, y) {
        // Uninitialized netType; default entity.
        this.netType = -1;

        // Entities have a position and velocity.
        this.position = {
            x,
            y
        };
        this.velocity = {
            x: 0,
            y: 0
        };

        // Add the entity to the entity array.
        entities.push(this);
    }

    tick (tickSpeed) {
        // Move the entity by its velocity every tick and adjust for timing error.
        this.position.x += this.velocity.x * tickSpeed;
        this.position.y += this.velocity.y * tickSpeed;
    }

    destroy () {
        // Remove the entity from the entities array.
        entities.splice(entities.indexOf(this), 1);
    }
}

module.exports = Entity;
