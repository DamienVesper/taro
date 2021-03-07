const entities = [];

const doEntityTick = tickSpeed => {
    for (const entity of entities) entity.tick(tickSpeed);
};

module.exports = {
    entities,
    doEntityTick
};
