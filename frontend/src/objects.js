const PIXI = require("pixi.js");
const pixi = require('./pixi.js');
const io = require("./io.js");
const fco = require.context("../assets/objects/", false, /\.png$/);
const loadTexture = require("../lib/loadTexture.js");
let players = {};

exports.pre = async () => {
    players = await loadTexture(fco);
}

function init() {

    let data = {};

    io.state.register((key, last, cur) => {
        if(!key.startsWith("o"))
            return;
        if(last && cur)
            update(key, cur);
        else if (cur)
            add(key, cur);
        else
            rm(key);
    });


    let index = 2;

    function add(key, cur) {
        const obj = new PIXI.Sprite(players[cur.texture]);
        obj.interactive = true;
        obj.buttonMode = true;
        obj.anchor.set(0.5);
        obj
            .on('pointerdown', onDragStart)
            .on('pointerup', onDragEnd)
            .on('pointerupoutside', onDragEnd)
        obj.zIndex = cur.zIndex;
        obj.x = cur.x;
        obj.y = cur.y;
        obj._ = {
            key : key,
            texture : cur.texture,
            dragging: false,
        };
        pixi.v.addChild(obj);
        data[key] = obj;
    }

    function update(key, cur) {
        let obj = data[key];
        if(obj._.texture !== cur.texture) {
            obj.setTexture(players[cur.texture]);
            obj._.texture = cur.texture;
        } if(obj.zIndex !== cur.zIndex)
            obj.zIndex = cur.zIndex;
        if(obj.x !== cur.x)
            obj.x = cur.x;
        if(obj.y !== cur.y)
            obj.y = cur.y;
    }

    function rm(key) {
        let obj = data[key];
        obj
        .off('pointerdown', onDragStart)
        .off('pointerup', onDragEnd)
        .off('pointermove', onDragMove)
        .off('pointerupoutside', onDragEnd)
        obj.destroy();
        delete data[key];
        if(this._.dragging)
            pixi.v.plugins.resume('drag');
    }

    function onDragStart(event) {
        this.on('pointermove', onDragMove);
        pixi.v.plugins.pause('drag');
        this.zIndex = ++index;
        this._.data = event.data;
        this._.dragging = true;
        this.alpha = 0.5;
    }

    async function onDragEnd() {
        this.off('pointermove', onDragMove);
        pixi.v.plugins.resume('drag');
        this.alpha = 1;
        delete this._.data;
        this._.dragging = false;

        if(!(await io.state.write(this._.key, {
            texture : this._.texture,
            zIndex : this.zIndex,
            x : this.x,
            y : this.y,
        })) && data[this._.key])
            update(this._.key, io.state.obj[this._.key]);
    }

    function onDragMove() {
        const newPosition = this._.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
    }
}

exports.init = init;