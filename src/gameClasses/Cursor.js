let Cursor = IgeEntity.extend({
    classId: `Cursor`,

    init: function ()
    {
        IgeEntity.prototype.init.call(this);

        let self = this;

        if (ige.isClient)
        {
            let tex = new IgeTexture(`${ige.map.mapUrl}/spritesheet/baseball_bat.png`);
            self.depth(10)
                .layer(20)
                .width(50)
                .height(50)
                .texture(tex);
        }
    },

    /**
     * Called every frame by the engine when this entity is mounted to the scenegraph.
     * @param ctx The canvas context to render to.
     */
    tick: function (ctx) {
        // Call the IgeEntity (super-class) tick() method
        IgeEntity.prototype.tick.call(this, ctx);
    }
});

module.exports = Cursor;
