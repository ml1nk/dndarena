//https://pixijs.io/pixi-particles-editor/#
//https://www.npmjs.com/package/pixi-particles
const particles = require('pixi-particles');
const sprites = require('./sprites.js');
const pixi = require('./pixi.js');
const io = require('./io.js');
const PIXI = require('pixi.js');

let elapsed;
let count = 0;
let length = 0;
const data = {};
const effects = {};

function init(me) {

    effects.glow = [
        [sprites.particles.glow],
        require("./../emitter/pointer.json")
    ];

    let key;
    $(document).mousedown((b)=>{
        if(b.which!==2) return;
        pixi.v.on("mousemove",mousemove);
        let pt = pixi.v.toLocal(new PIXI.Point(b.clientX, b.clientY));
        key = add("glow",pt.x, pt.y);
    });
    
    $(document).mouseup((b)=>{
        if(b.which!==2) return;
        pixi.v.off("mousemove",mousemove);
        rm(key);
    });

    function mousemove(e) {
        let local = e.data.getLocalPosition(pixi.v);
        move(key, local.x, local.y);
    }

}

function rm(key) {
    data[key].destroy();
    pixi.v.removeChild(data[key].parent);
    delete data[key];
    length--;
}

function move(key, x, y) {
    data[key].updateOwnerPos(x, y);
}

function add(type, x, y) {
    const ec = new PIXI.Container();
    pixi.v.addChild(ec);
    const emitter = new particles.Emitter(ec, effects[type][0], effects[type][1]);
    emitter.updateOwnerPos(x, y);
    emitter.emit = true;
    data[count++] = emitter;
    length++;
    if (length === 1) {
        elapsed = Date.now();
        update();
    }
    return count - 1;
}

function update() {
    let empty = true;
    let now = Date.now();
    for (key in data) {
        empty = false;
        data[key].update((now - elapsed) * 0.001);
    }
    if (empty) return;
    elapsed = now;
    requestAnimationFrame(update);
}

/*
    ,
    p.onMouseUp = function() {
        emitter && (emitter.resetPositionTracking(),
        emitter.emit = !0,
        emitterEnableTimer = 0)
    }
    ,
    p.onMouseIn = function() {
        emitter && (interaction.on("stagemove", this.onMouseMove),
        emitter.resetPositionTracking())
    }
    ,
    p._centerEmitter = function() {
        emitter && emitter.ownerPos && emitter.updateOwnerPos(this.display.canvas.width / 2, this.display.canvas.height / 2)
    }
    ,
    p.onMouseOut = function() {
        emitter && (interaction.off("stagemove", this.onMouseMove),
        this._centerEmitter(),
        emitter.resetPositionTracking())
    }
    ,
    p.onMouseMove = function(a) {
        if (emitter) {
            var b = a.data;
            emitter.updateOwnerPos(b.global.x, b.global.y)
        }
    }
    */

window.init = init;
window.add = add;
window.rm = rm;
window.move = move;

exports.init = init;