const $ = require('jquery');
const sprites = require('./sprites.js');
const pixi = require('./pixi.js');
const io = require('./io.js');
const PIXI = require('pixi.js');
const emitter = require('./../lib/emitter.js')(pixi.v);
const throttle = require('throttle-debounce').throttle;

const throttleDelay = 150;

function init(me) {

    const images = [sprites.particles.glow];
    const config = require("./../emitter/pointer.json");

    let lastX;
    let lastY;
    let cb; 

    io.socket.on("emitter", (data)=>{
        switch(data.type) {
            case "down":
                emitter.add(data.id, data.x, data.y, images, config);
                break;
            case "up":
                emitter.rm(data.id);
                break;
            case "move":
                emitter.move(data.id, data.x, data.y);
            break;
        }
    });


    $(document).mousedown((b)=>{
        if(b.which!==2) return;
        pixi.v.on("mousemove",mousemove);
        let pt = pixi.v.toLocal(new PIXI.Point(b.clientX, b.clientY));
        io.socket.emit("emitter", {
            type : "down", 
            id: me.id,
            x: pt.x,
            y: pt.y
        });
        if(cb)
            cb.cancel();
        lastX = pt.x;
        lastY = pt.y;
        cb = throttle(throttleDelay, ()=>{
            io.socket.emit("emitter", {
                type : "move", 
                id: me.id,
                x: lastX,
                y: lastY
            },true);
        })
        emitter.add(me.id, pt.x, pt.y, images, config);
        window.test = io.socket;
    });
    
    $(document).mouseup((b)=>{
        if(b.which!==2) return;
        if(cb)
            cb.cancel();
        pixi.v.off("mousemove",mousemove);
        io.socket.emit("emitter", {
            type : "up", 
            id: me.id
        });
        emitter.rm(me.id);
    });

    function mousemove(e) {
        let pt = e.data.getLocalPosition(pixi.v);
        emitter.move(me.id, pt.x, pt.y);
        lastX = pt.x;
        lastY = pt.y;
        if(cb)
            cb();
    }

}

exports.init = init;