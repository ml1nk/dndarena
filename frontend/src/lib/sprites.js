const PIXI = require("pixi.js");
const pixi = require('./pixi.js');
const calc = require("./calc.js");
const hexagon = require("./../config.json").hexagon;
let req = require.context("../../assets/fields/", false, /\.png$/);

const data = {};

const pol = [
    -hexagon.radius, 0,
    -hexagon.radius/2, calc.height()/2,
    hexagon.radius/2, calc.height()/2,
    hexagon.radius, 0,
    hexagon.radius/2, -calc.height()/2,
    -hexagon.radius/2, -calc.height()/2,
    -hexagon.radius, 0
];
const fields = {};
const loader = new PIXI.loaders.Loader();
req.keys().forEach(function(key){
    loader.add(key.slice(2,-4), req(key));
});

let resolve;
let promise = new Promise((_resolve)=>{
    resolve = _resolve;
});

loader.load((loader, resources) => {
    for(let key in resources) {
        fields[key] = genHex(resources[key].texture);
    }
    resolve();
})


function genHex(tex, x, y, z) {
    let mask = new PIXI.Graphics()
    .beginFill(0x000000)
    .drawPolygon(pol)
    .endFill()

    let g = new PIXI.Graphics()
    .lineStyle(hexagon.border*1.1, 0x444444, 1, 0.9091);

    for(let i=0; i<pol.length/2; i++) {
        if(i==0) {
            g.moveTo(pol[0], pol[1]);
        } else {
            g.lineTo(pol[i*2], pol[i*2+1]);
        }
    }

    let i = new PIXI.Sprite(tex);
    i.x = -hexagon.radius;
    i.y = -calc.height()/2;
    i.mask = mask;

    let reel = new PIXI.Container();
    reel.addChild(i);
    reel.addChild(g);
    return pixi.app.renderer.generateTexture(reel);
}

function add(name, x, y, z) {
    if(data.hasOwnProperty(calc.to(x,y,z))) {
        data[calc.to(x,y,z)].texture = fields[name];
        return;
    }

    let s = new PIXI.Sprite(fields[name]);
    s.anchor.set(0.5,0.5);
    s.position = calc.cube_to_pixel(x,y,z);
    data[calc.to(x,y,z)] = s;

    pixi.v.addChild(s);
}

function del(x, y, z) {
    if(!data.hasOwnProperty(calc.to(x,y,z))) return;
    let s = data[calc.to(x,y,z)];
    pixi.v.removeChild(s);
    delete data[calc.to(x,y,z)];
}

function clear() {
    for(let key in data) {
        pixi.v.removeChild(data[key]);
        delete data[key];
    }
}

exports.add = add;
exports.del = del;
exports.clear = clear;
exports.promise = promise;