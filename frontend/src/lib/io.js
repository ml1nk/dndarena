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

exports.init = () => io.open();

/*
   io.on("load", obj=>load(obj,false));
   io.on("message",obj=>message(obj, false));
   io.on("field/add",obj=>sprites.add(obj.name,obj.x,obj.y,obj.z));
   io.on("field/del",obj=>exports.field.del(obj.x,obj.y,obj.z, false));
   io.on("audio",obj=>{
       state.audio = obj;
       sync_audio();
   });*/

/*

function message(text, so=true) {
    if(so) io.emit("message",text);
    chat.add(text, so);
}

function load(data, so=true) {
    if(so) io.emit("load",data);
    sprites.clear();
    state = data;
    console.log("init", state);
    sync_field();
    sync_audio();
}

function sync_field() {
    for(let key in state.field) {
        let [x, y, z] = calc.from(key);
        sprites.add(state.field[key],x,y,z);
    }
}

function sync_audio() {
    $("#button-play span")
        .removeClass(state.audio.play ? "glyphicon-play" : "glyphicon-pause")
        .addClass(state.audio.play ? "glyphicon-pause" : "glyphicon-play");
    audio.set(state.audio.play, state.audio.id, state.audio.time);
}


let field_add = (obj) => sprites.add(obj.name,obj.x,obj.y,obj.z);
let field_del = (obj) => sprites.del(obj.x,obj.y,obj.z);
let field_del = (obj) => sprites.del(obj.x,obj.y,obj.z);

exports.field = {
    add : (name, x, y, z, so=true) => {
        if(so) io.emit("field/add",{
            name : name,
            x : x, 
            y : y,
            z : z
        });
        sprites.add(name,x,y,z);
    },
    del : (x,y,z, so=true) => {
        if(so) io.emit("field/del",{
            x : x, 
            y : y,
            z : z
        });
        sprites.del(x,y,z);
    }
}

exports.audio = (play, id, time)=> {
    if((state.audio.play && !play) || (!state.audio.play && play)) time = (Date.now()/1000)-time;
    io.emit("audio",{ play : play, id : id, time : time});
};
*/