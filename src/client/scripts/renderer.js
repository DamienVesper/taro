const renderer = new PIXI.Application({
    width: 800,
    height: 600,
    antialias: true,
    transparent: false,
    autoResize: true,
    forceCanvas: false
});

renderer.scene = new PIXI.Container();

module.exports = renderer;
