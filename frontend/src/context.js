const $ = require('jquery');
require('jquery-ui/ui/position');
require('jquery-contextmenu/dist/jquery.contextMenu');
require('jquery-contextmenu/dist/jquery.contextMenu.css');
const io = require('./io.js');
const pixi = require('./pixi.js');
const calc = require('../lib/calc.js');

function init(me) {
    if(!me.gm) return;

    let field;

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
                callback: key => {
                    if(key==="sep1") return;
                    if(key==="del") {
                        io.state.set("field."+field.x+":"+field.y+":"+field.z,null);
                        return;
                    }
                    io.state.set("field."+field.x+":"+field.y+":"+field.z,key);
                },
                items: {
                    "fold1": {
                        "name": "Fieldtype", 
                        "items": {
                            "grass1": {name: "Grass 1"},
                            "grass2": {name: "Grass 2"},
                            "dirt1": {name: "Dirt 1"},
                            "impassable1": {name: "Impassable 1"},
                            "transparent": {name: "Transparent"},
                            "del": {name: "Empty"}
                        }
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