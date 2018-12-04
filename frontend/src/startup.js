const $ = require("jquery");
require("jquery-confirm/js/jquery-confirm.js");
require("jquery-toggles/toggles.js");
require("jquery-confirm/css/jquery-confirm.css");
require("jquery-toggles/css/toggles.css");
require("jquery-toggles/css/themes/toggles-modern.css");
const params = require("./../lib/params.js");

let name;
let gm;

exports.init = ()=>new Promise(resolve=>startup(resolve));

function startup(res) {
    if(params.get("name") && params.get("room") && params.get("gm")) {
        res({name:params.get("name"), gm:params.get("gm")!=="0", room:params.get("room")});
        return;
    }

    $.confirm({
        title: 'Login',
        draggable: false,
        content: require("./startup.html"),
        buttons: {
            formSubmit: {
                text: 'Save',
                btnClass: 'btn-blue',
                action: function() {
                    name = this.$content.find('.name').val();
                    room = this.$content.find('.room').val();
                    gm = $('#init-toggle').data('toggles').active;
                    params.add("name",name);
                    params.add("room",room);
                    params.add("gm",gm?"1":"0")
                    if(name && room) {
                        res({name:name, gm:gm, room:room});
                        return true;
                    }
                    return false;
                }
            }
        },
        onContentReady: function () {
            $('#init-toggle').toggles({
                text:{on:'GM',off:'Player'},
                width: 170,
                height: 50,
                on: !!params.get("gm")
            });
            this.$content.find('.name').val(params.get("name"));
            this.$content.find('.room').val(params.get("room"));
            var jc = this;
            this.$content.find('form').on('submit', (e) => {
                e.preventDefault();
                jc.$$formSubmit.trigger('click');
            });
        }
    });
}