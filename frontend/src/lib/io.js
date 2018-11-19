let socket = require("socket.io-client");
let sprites = require("./sprites.js");
let calc = require("./calc.js");
let chat = require("./chat.js");

let state;
let io;

exports.init = ()=>{
    io = socket();
    io.on("load", obj=>load(obj,false));
    io.on("message",obj=>message(obj, false));
    io.on("field/add",obj=>exports.field.add(obj.name,obj.x,obj.y,obj.z, false));
    io.on("field/del",obj=>exports.field.del(obj.x,obj.y,obj.z, false));
    io.on("audio/play",obj=>exports.audio.play(obj, false));
}


function message(text, so=true) {
    if(so) io.emit("message",text);
    chat.add(text, so);
}

function load(data, so=true) {
    if(so) io.emit("load",data);
    sprites.clear();
    state = data;
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
}

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
exports.audio = {
    play : (play, so=true) =>{
        if(so) io.emit("audio/play",play);
        state.audio.play = play;
        sync_audio();
    }
}
exports.load = load;
exports.message = message;
