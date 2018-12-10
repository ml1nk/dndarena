const PIXI = require("pixi.js");
const pixi = require('./pixi.js');
const calc = require("../lib/calc.js");
const hexagon = require("./../config.json").hexagon;
const io = require("./io.js");
const data = {};
const fco = require.context("../assets/fields/", false, /\.png$/);
const pco = require.context("../assets/particles/", false, /\.png$/);
const types = {};
const typesi = {};
const particles = {};

exports.pre = () => {
    const flo = new PIXI.loaders.Loader();
    fco.keys().forEach((key)=>{
        flo.add(key.slice(2, -4), fco(key));
    });

    const plo = new PIXI.loaders.Loader();
    pco.keys().forEach((key)=>{
        plo.add(key.slice(2, -4), pco(key));
    });

    return new Promise((resolve) => {
        flo.load((loader, resources) => {
            for (let key in resources) {
                types[key] = genHex(resources[key].texture);
                typesi[key] = genHex(resources[key].texture,resources["unknowngm"].texture);
            }
            finish();
        });
        plo.load((loader, resources) => {
            for (let key in resources) {
                particles[key] = resources[key].texture;
            }
            finish();
        });
        let i = 0;
        function finish() {
            i++;
            if(i==2) resolve();
        }
    });
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

    io.state.on("field.*", (key, pre) => {
        let [x, y, z] = calc.from(key);
        if (typeof pre[key] === "undefined") {
            del(x, y, z);
        } else {
            add(pre[key], x, y, z);
        }
    });

    io.state.on("", (state) => {
        clear();
        for (let key in state.field) {
            let [x, y, z] = calc.from(key);
            add(state.field[key], x, y, z);
        }
    });

    function add(obj, x, y, z) {
        let name = !me.gm && !obj.visible ? "unknown" : obj.type;
        let f = me.gm && !obj.visible ? typesi : types;
        if (data.hasOwnProperty(calc.to(x, y, z))) {
            data[calc.to(x, y, z)].texture = f[name];
            return;
        }

        let s = new PIXI.Sprite(f[name]);
        s.anchor.set(0.5, 0.5);
        s.position = calc.cube_to_pixel(x, y, z);
        data[calc.to(x, y, z)] = s;

        pixi.v.addChild(s);
    }

    function del(x, y, z) {
        if (!data.hasOwnProperty(calc.to(x, y, z))) return;
        let s = data[calc.to(x, y, z)];
        pixi.v.removeChild(s);
        delete data[calc.to(x, y, z)];
    }

    function clear() {
        for (let key in data) {
            pixi.v.removeChild(data[key]);
            delete data[key];
        }
    }

}