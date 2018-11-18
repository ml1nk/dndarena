const $ = require('jquery');
require('jquery-ui/ui/position');
require('jquery-contextmenu/dist/jquery.contextMenu');
require('jquery-contextmenu/dist/jquery.contextMenu.css');
const sprites = require('./sprites.js');
const io = require('./io.js');


let field;
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
                console.log("test",field);
                if(key==="sep1") return;
                if(key==="del") {
                    io.del(field.x, field.y, field.z);
                    return;
                } 
                io.add(key, field.x, field.y, field.z);
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


exports.field = (global, x, y, z) => {
    field = {
        global : global,
        x : x,
        y : y,
        z : z
    }
    $('#context-menu-field').contextMenu();
}