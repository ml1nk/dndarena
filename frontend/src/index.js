const pixi = require('./lib/pixi.js');
const sprites = require('./lib/sprites.js');
const io = require('./lib/io.js');
const slider = require('./lib/slider.js');
const button = require('./lib/button.js');
const input = require('./lib/input.js');
const chat = require('./lib/chat.js');

document.body.appendChild(pixi.app.view);

(async ()=>{
    let sp = sprites.promise;
    await input.init();
    await sp;
    chat.init();
    io.init();
    slider.init();
    button.init();
})();



//createBunny(0,0,0);

/*
function createBunny(x, y, z) {
    let position = toHexagonPosition(x,y,z);

    var g = new PIXI.Graphics();
    g.beginFill(0xA34020);
    g.drawPolygon([
      -hexagonRadius, 0,
      -hexagonRadius/2, hexagonHeight/2,
      hexagonRadius/2, hexagonHeight/2,
      hexagonRadius, 0,
      hexagonRadius/2, -hexagonHeight/2,
      -hexagonRadius/2, -hexagonHeight/2,
    ]);
    g.endFill();
    g.x = position.x;
    g.y = position.y;
    g.interactive = true;
    g.buttonMode = true;
    g
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);
    v.addChild(g);
}*/


/*

function onDragStart(event) {
    event.stopPropagation();
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
}

function onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    this.data = null;
}

function onDragMove() {
    if (!this.dragging) return;
    var newPosition = this.data.getLocalPosition(this.parent);
    var hexaP = toHexagonPosition(newPosition.x, newPosition.y);
    this.x = hexaP.x;
    this.y = hexaP.y;
}
*/