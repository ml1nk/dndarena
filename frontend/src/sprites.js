const PIXI = require("pixi.js");
const pixi = require('./pixi.js');
const calc = require("../lib/calc.js");
const hexagon = require("./../config.json").hexagon;
const io = require("./io.js");
const data = {};
const req = require.context("../assets/fields/", false, /\.png$/);
const fields = {};

exports.init = () => {
    const loader = new PIXI.loaders.Loader();
    req.keys().forEach(function(key){
        loader.add(key.slice(2,-4), req(key));
    });

    io.state.on("field.*",(key, pre)=>{
        let [x, y, z] = calc.from(key);
        if(typeof pre[key] === "undefined") {
            del(x,y,z);
        } else {
            add(pre[key],x,y,z);
        }
    });

    io.state.on("",(state)=>{
        clear();
        for(let key in state.field) {
            let [x, y, z] = calc.from(key);
            add(state.field[key],x,y,z);
        }
    });
    
    return new Promise((resolve)=>{
        loader.load((loader, resources) => {
            for(let key in resources) {
                fields[key] = genHex(resources[key].texture);
            }
            resolve();
        })
    });
}

function genHex(tex, x, y, z) {
    let pol = calc.pol();
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
