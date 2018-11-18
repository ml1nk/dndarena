const PIXI = require('pixi.js');
const viewport = require('pixi-viewport');
const context = require('./context.js');
const calc = require('./calc.js');
const hexagon = require('./../config.json').hexagon;

var app = new PIXI.Application( window.innerWidth, window.innerHeight, {
    transparent: true,
    antialias: true
});

var v = new viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    interaction: app.renderer.interaction
});

exports.app = app;
exports.v = v;

v.interactive = true;
v.on("rightclick",e=>{
    let local = e.data.getLocalPosition(v);
    let [x,y,z] = calc.pixel_to_cube(local.x,local.y);
    context.field(e.data.global, x, y, z);
});


let initialWidth = window.innerWidth;
let initialHeight = window.innerHeight;
window.addEventListener("resize", resize);
app.stage.addChild(v);
v.drag().pinch().wheel().clampZoom({
    minWidth : hexagon.radius*3,
    minHeight : hexagon.radius*3,
    maxWidth : hexagon.radius*30,
    maxHeight : hexagon.radius*30
});

v.position.set(window.innerWidth/2, window.innerHeight/2);

function resize() {
    v.position.x = v.position.x+(window.innerWidth-initialWidth)/2;
    v.position.y = v.position.y+(window.innerHeight-initialHeight)/2;
    app.renderer.resize(window.innerWidth, window.innerHeight);
    v.resize(window.innerWidth, window.innerHeight);
    initialWidth = window.innerWidth;
    initialHeight = window.innerHeight;
}
