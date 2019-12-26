const PIXI = require("pixi.js");
const pixi = require('./pixi.js');
const fco = require.context("../assets/players/", false, /\.png$/);
const loadTexture = require("../lib/loadTexture.js");
let players = {};

exports.pre = async () => {
    players = await loadTexture(fco);
}

function init(me) {

    let index = 2;

    // create a texture from an image path
    let texture = players["player1"];

    for (let i = 0; i < 10; i++) {
        createBunny(
            Math.floor(Math.random() * pixi.app.screen.width),
            Math.floor(Math.random() * pixi.app.screen.height),
        );
    }

    function createBunny(x, y) {
        // create our little bunny friend..
        const bunny = new PIXI.Sprite(texture);

        // enable the bunny to be interactive... this will allow it to respond to mouse and touch events
        bunny.interactive = true;

        // this button mode will mean the hand cursor appears when you roll over the bunny with your mouse
        bunny.buttonMode = true;

        // center the bunny's anchor point
        bunny.anchor.set(0.5);

        // make it a bit bigger, so it's easier to grab
        bunny.scale.set(1);
        bunny.zIndex = index;

        // setup events for mouse + touch using
        // the pointer events
        bunny
            .on('pointerdown', onDragStart)
            .on('pointerup', onDragEnd)
            .on('pointerupoutside', onDragEnd)
            .on('pointermove', onDragMove);
        
        // move the sprite to its designated position
        bunny.x = x;
        bunny.y = y;

        // add it to the stage
        pixi.v.addChild(bunny);
    }

    function onDragStart(event) {
        pixi.v.plugins.pause('drag');
        this.zIndex = ++index;
        this.data = event.data;
        this.alpha = 0.5;
        this.dragging = true;
    }

    function onDragEnd() {
        pixi.v.plugins.resume('drag');
        this.alpha = 1;
        this.dragging = false;
        this.data = null;
    }

    function onDragMove() {
        if (this.dragging) {
            const newPosition = this.data.getLocalPosition(this.parent);
            this.x = newPosition.x;
            this.y = newPosition.y;
        }
    }
}

exports.init = init;