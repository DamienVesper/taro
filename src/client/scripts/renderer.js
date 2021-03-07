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

        this.world = new PIXI.Container();
    }

    resize () {
        const wW = window.innerWidth;
        const wH = window.innerHeight;

        this.renderer.resize(wW, wH);
    }

    viewport () {
        this.viewport = new PIXI.extras.Viewport({
            screenWidth: 800,
            screenHeight: 800,

            worldWidth: this.world.worldWidth,
            worldHeight: this.world.worldHeight,

            interaction: this.renderer.plugins.interaction
        }).decelerate();

        this.viewport.on(`snap-zoom-start`, () => this.viewport.isZooming = true);
        this.viewport.on(`snap-zoom-end`, () => this.viewport.isZooming = false);

        this.viewport.addChild(this.world);
        this.renderer.stage.addChild(this.viewport);

        this.cull = new PIXI.extras.cull.Simple();
        this.cull.addList(this.world.children);
        this.cull.cull(this.viewport.getVisibleBounds());

        this.resize();
    }
}

module.exports = Renderer;
