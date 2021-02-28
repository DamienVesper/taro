let IgeCuboidSmartTexture = {
    render: function (ctx, entity) {
        let poly = entity.localIsoBoundsPoly();

        ctx.strokeStyle = `#a200ff`;

        poly.render(ctx);
    }
};
