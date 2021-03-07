class Renderer {
    constructor () {
        this.renderer = new PIXI.Application({
            width: 800,
            height: 600,
            antialias: true,
            transparent: false,
            autoResize: true,
            forceCanvas: false
        });

        this.renderer.scene = new PIXI.Container();
    }

    resize () {
        const wW = window.innerWidth;
        const wH = window.innerHeight;

        this.renderer.resize(wW, wH);
    }
}

module.exports = Renderer;
