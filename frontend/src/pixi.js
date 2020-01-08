const PIXI = require('pixi.js');
const viewport = require('pixi-viewport').Viewport
const hexagon = require('./../config.json').hexagon;

const ticker = PIXI.Ticker.shared;
ticker.autoStart = false;
ticker.stop();

const app = new PIXI.Application({
    width: window.innerWidth, 
    height: window.innerHeight,
    sharedTicker: true,
    sharedLoader: true,
    transparent: true,
    autoStart: false,
    resizeTo:window
});

const v = new viewport({
    interaction: app.renderer.interaction, 
    interactive: true, 
    sortableChildren: true
});

function init() {
    app.stage.addChild(v);
    v.drag({ mouseButtons : "left"}).pinch().wheel().clampZoom({
        minWidth: hexagon.radius * 3,
        minHeight: hexagon.radius * 3,
        maxWidth: hexagon.radius * 30,
        maxHeight: hexagon.radius * 30
    });
    v.position.set(window.innerWidth / 2, window.innerHeight / 2);
    ticker.start();
}

exports.app = app;
exports.v = v;
exports.init = init;