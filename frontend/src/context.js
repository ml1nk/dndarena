const $ = require('jquery');
require('jquery-ui/ui/position');
require('jquery-contextmenu/dist/jquery.contextMenu');
require('jquery-contextmenu/dist/jquery.contextMenu.css');
const io = require('./io.js');
const config = require('./../config.json');
const pixi = require('./pixi.js');
const calc = require('../lib/calc.js');

function init(me) {
    if(!me.gm) return;

    let field;
    let set = key=>{
        let obj = io.state.get().field[calc.to(field.x,field.y,field.z)];
        io.state.set("field."+ calc.to(field.x,field.y,field.z),{ type :key, visible : obj && obj.visible});
    };
    let data = config.types.map(vl=>{ return {name:vl[1],callback:()=>set(vl[0])}}).concat(["---------",{name:"Clear",callback : ()=>set(null)}]);

    let time = 0;
    pixi.v.on("click",e=>{
        if(time+200<Date.now()) {
            time = Date.now();
            return;
        }
        let local = e.data.getLocalPosition(pixi.v);
        let [x,y,z] = calc.pixel_to_cube(local.x,local.y);
        let obj = io.state.get().field[calc.to(x,y,z)];

        if(!obj) return;

        obj.visible = !obj.visible;
        io.state.set("field."+calc.to(x,y,z), obj);
    });

    pixi.v.on("rightclick",e=>{
        let local = e.data.getLocalPosition(pixi.v);
        let [x,y,z] = calc.pixel_to_cube(local.x,local.y);
        _field(e.data.global, x, y, z);
    });

    $.contextMenu({
        selector: '#context-menu-field', 
        trigger: 'none',
        position: opt=>opt.$menu.css({top: field.global.y, left: field.global.x}),
        build: function($trigger, e) {
            // this callback is executed every time the menu is to be shown
            // its results are destroyed every time the menu is hidden
            // e is the original contextmenu event, containing e.pageX and e.pageY (amongst other data)
            return {
                items: {
                    "fold1": {
                        "name": "Type", 
                        "items": data
                    }
                }
            };
        }
    });

    function _field(global, x, y, z) {
        field = {
            global : global,
            x : x,
            y : y,
            z : z
        }
        $('#context-menu-field').contextMenu();
    }
}

exports.init = init;