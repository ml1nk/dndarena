const PIXI = require("pixi.js");
const pixi = require('./pixi.js');
const calc = require("../lib/calc.js");
const loadTexture = require("../lib/loadTexture.js");
const hexagon = require("./../config.json").hexagon;
const io = require("./io.js");
const data = {};
const fco = require.context("../assets/fields/", false, /\.png$/);
const pco = require.context("../assets/particles/", false, /\.png$/);
const types = {};
const typesi = {};
const particles = {};

exports.pre = async () => {
    let [fcoR, pcoR] = await Promise.all([loadTexture(fco), loadTexture(pco)]);
    for (let key in fcoR) {
        types[key] = genHex(fcoR[key]);
        typesi[key] = genHex(fcoR[key],fcoR["unknowngm"]);
    }
    for (let key in pcoR) {
        particles[key] = pcoR[key];
    }
}


function genHex(tex, gm) {
    let pol = calc.pol();
    let mask = new PIXI.Graphics()
        .beginFill(0x000000)
        .drawPolygon(pol)
        .endFill()

    let g = new PIXI.Graphics()
        .lineStyle(hexagon.border * 1.1, 0x444444, 1, 0.9091);

    for (let i = 0; i < pol.length / 2; i++) {
        if (i == 0) {
            g.moveTo(pol[0], pol[1]);
        } else {
            g.lineTo(pol[i * 2], pol[i * 2 + 1]);
        }
    }

    let reel = new PIXI.Container();
    let i = new PIXI.Sprite(tex);
    i.x = -hexagon.radius;
    i.y = -calc.height() / 2;
    i.mask = mask;
    reel.addChild(i);

    if(gm) {
        let f = new PIXI.Sprite(gm);
        f.x = -hexagon.radius;
        f.y = -calc.height() / 2;
        f.mask = mask;
        reel.addChild(f);
    }

    reel.addChild(g);
    return pixi.app.renderer.generateTexture(reel);
}

exports.particles = particles;

exports.init = (me) => {

    io.state.register((key, last, cur) => {
        if(!key.startsWith("f"))
            return;
        let [x, y, z] = calc.from(key);
        if (typeof cur !== "object")
            del(x, y, z);
        else
            add(cur, x, y, z);
    });

    function add(obj, x, y, z) {
        let name = !me.gm && !obj.visible ? "unknown" : obj.type;
        let f = me.gm && !obj.visible ? typesi : types;

        if (Object.prototype.hasOwnProperty.call(data, calc.to(x, y, z))) {
            data[calc.to(x, y, z)].texture = f[name];
            return;
        }

        let s = new PIXI.Sprite(f[name]);
        s.anchor.set(0.5, 0.5);
        s.position = calc.cube_to_pixel(x, y, z);
        s.zIndex = 1;
        data[calc.to(x, y, z)] = s;

        pixi.v.addChild(s);
    }

    function del(x, y, z) {
        if (!Object.prototype.hasOwnProperty.call(data, calc.to(x, y, z))) return;
        let s = data[calc.to(x, y, z)];
        pixi.v.removeChild(s);
        delete data[calc.to(x, y, z)];
    }
}