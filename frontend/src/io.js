const socket = require("socket.io-client");
const ev3 = require("eventemitter3");
const eso = require('event-shared-object');

let io = socket({
    autoConnect: false,
    transports: ['websocket'],
    path: location.pathname+'ws/'
});
let ev = new ev3();


let slave = eso.slave("state", io.on.bind(io), io.emit.bind(io), async (key, last, cur)=>{
    if(key.startsWith("f")) {
        ev.emit("f", key, cur);
    } else if(key === "audio") {
        ev.emit("audio", cur);
    }
});

exports.state = {
        write: slave.write,
        obj : slave.obj,
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