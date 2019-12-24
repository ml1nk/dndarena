require('./css/main.css');
require('./css/button.css');
require('./src/pwa.js');

const pixi = require('./src/pixi.js');
const sprites = require('./src/sprites.js');
const io = require('./src/io.js');
const slider = require('./src/slider.js');
const audio = require('./src/audio.js');
const loadsave = require('./src/loadsave.js');
const dialog = require('./src/startup.js');
const chat = require('./src/chat.js');
const context = require('./src/context.js');
const emitter = require('./src/emitter.js');

document.body.appendChild(pixi.app.view);

(async () => {
    let sp = sprites.pre();
    let me = await dialog.init();
    await sp;
    audio.init(me);
    chat.init(me);
    context.init(me);
    slider.init(me);
    loadsave.init(me);
    sprites.init(me);
    emitter.init(me);
    io.init(me);
})();