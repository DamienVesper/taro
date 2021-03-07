let IgeUiInlineFlow = IgeUiElement.extend({
    classId: `IgeUiInlineFlow`,

    init: function () {
        IgeUiElement.prototype.init.call(this);
    },

    tick: function (ctx) {
        // Loop children and re-position them
        let arr = this._children;
        let arrCount = arr.length; let i;
        let item; let itemY; let currentX = 0;

        for (i = 0; i < arrCount; i++) {
            item = arr[i];
            itemX = item._bounds2d.x;
            item.left(currentX);
            currentX += itemX;
        }

        // call the super-class tick
        IgeUiElement.prototype.tick.call(this, ctx);
    }
});
