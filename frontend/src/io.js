const socket = require("socket.io-client");
const ev3 = require("eventemitter3");

let state = {};
let io = socket({
    autoConnect: false,
    transports: ['websocket']
});
let ev = new ev3();

io.on("state", obj => {
    if (obj[0] === "") {
        state = obj[1];
    } else {
        let parts = obj[0].split('.');
        let pre = parts.slice(0, -1).reduce((o, i) => o[i], state);
        if(obj[1]===null) {
            delete pre[parts.slice(-1)[0]];
        } else {
            pre[parts.slice(-1)[0]] = obj[1];
        }
        ev.emit(parts.slice(0,-1).join(".")+".*",parts.slice(-1)[0], pre, state);
    }
    ev.emit(obj[0], obj[1], state);
});

exports.state = {
        set: (key, value) => io.emit("state", [key, value]),
        get: ()=>state,
        on: ev.on.bind(ev),
        once: ev.once.bind(ev),
        off: ev.off.bind(ev),
};
exports.message = {
    out: (text) => io.emit("message", text),
    in: (cb) => io.on("message", cb)
};
exports.audio = (v, cb) => io.emit("audio", v, cb);

exports.init = (me) => {
    io.io.opts.query = {room:me.room};    
    io.open();
}