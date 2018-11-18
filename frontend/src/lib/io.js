let socket = require("socket.io-client");
let sprites = require("./sprites.js");
let calc = require("./calc.js");
let chat = require("./chat.js");

let state;
let io;

exports.init = ()=>{
    io = socket();
    io.on("load", obj=>load(obj,false));
    io.on("add",obj=>add(obj.name,obj.x,obj.y,obj.z, false));
    io.on("del",obj=>del(obj.x,obj.y,obj.z, false));
    io.on("message",obj=>message(obj, false));

}

function load(data) {
    sprites.clear();
    state = data;
    apply();
}

function apply() {
    for(let key in state.field) {
        let [x, y, z] = calc.from(key);
        sprites.add(state.field[key],x,y,z);
    }
}

function add(name, x, y, z, so=true) {
    if(so) io.emit("add",{
        name : name,
        x : x, 
        y : y,
        z : z
    });
    sprites.add(name,x,y,z);
}

function del(x,y,z, so=true) {
    if(so) io.emit("del",{
        x : x, 
        y : y,
        z : z
    });
    sprites.del(x,y,z);
}

function message(text, so=true) {
    if(so) io.emit("message",text);
    chat.add(text, so);
}

function load(data, so=true) {
    if(so) io.emit("load",data);
    sprites.clear();
    state = data;
    apply();
}

exports.state = ()=>state;
exports.load = load;
exports.del = del;
exports.add = add;
exports.message = message;

