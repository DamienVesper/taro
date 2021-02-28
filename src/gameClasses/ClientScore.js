let ClientScore = IgeFontEntity.extend({
    classId: `ClientScore`,

    init: function (score) {
        IgeFontEntity.prototype.init.call(this);

        this.depth(1)
            .layer(20000)
            .width(400)
            .height(80)
            .texture(ige.client.fontTexture)
            .textLineSpacing(0)
            .text(score)
            .hide();
    },

    start: function (inMs) {
        let self = this;
        if (inMs) {
            setTimeout(() => { self.start(); }, inMs);
            return;
        }

        this.show();

        this._translate.tween()
            .duration(1000)
            .properties({
                y: this._translate.y - 25
            })
            .afterTween(() => {
                self.tween()
                    .duration(300)
                    .properties({
                        _opacity: 0
                    })
                    .afterTween(() => {
                        self.destroy();
                    })
                    .start();
            })
            .start();
    }
});
