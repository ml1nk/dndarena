const socket = require("socket.io-client");
const eso = require('event-shared-object');

let io = socket({
    autoConnect: false,
    transports: ['websocket'],
    path: location.pathname+'ws/'
});

let slave = eso.slave("state", io, io.emit.bind(io));

io.on("reconnect", slave.sync);

exports.state = slave;

exports.message = {
    out: (text) => io.emit("message", text),
    in: (cb) => io.on("message", cb)
};
exports.audio = (v, cb) => io.emit("audio", v, cb);

exports.init = (me) => {
    io.io.opts.query = {room:me.room};    
    io.open();
}