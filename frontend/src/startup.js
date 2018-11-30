const $ = require("jquery");
require("jquery-confirm/js/jquery-confirm.js");
require("jquery-toggles/toggles.js");
require("jquery-confirm/css/jquery-confirm.css");
require("jquery-toggles/css/toggles.css");
require("jquery-toggles/css/themes/toggles-modern.css");
const io = require("./io.js");

let name;
let gm;

exports.init = ()=>new Promise(resolve=>startup(resolve));

function startup(res) {
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
                    gm = $('#init-toggle').data('toggles').active;
                    if(name) {
                        res({name:name, gm:gm});
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
            });
            var jc = this;
            this.$content.find('form').on('submit', (e) => {
                e.preventDefault();
                jc.$$formSubmit.trigger('click');
            });
        }
    });
}