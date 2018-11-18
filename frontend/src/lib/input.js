const $ = require("jquery");
require("jquery-confirm/js/jquery-confirm.js");
require("jquery-toggles/toggles.js");
require("jquery-confirm/css/jquery-confirm.css");
require("jquery-toggles/css/toggles.css");
require("jquery-toggles/css/themes/toggles-modern.css");

let name;
let gm;


function init() {
    let res;
    let pro = new Promise(resolve=>res=resolve);
    $.confirm({
        title: 'Login',
        draggable: false,
        content: '' +
        '<form class="formName">' +
        '<div class="form-group"><br/>' +
        '<input type="text" placeholder="Character Name" class="name form-control" required /><br/>' +
        '<div id="init-toggle" style="margin: auto;height:50px" class="toggle toggle-modern">' +
        '</div>' +
        '</form>',
        buttons: {
            formSubmit: {
                text: 'Save',
                btnClass: 'btn-blue',
                action: function() {
                    name = this.$content.find('.name').val();
                    gm = $('#init-toggle').data('toggles').active;
                    if(name) {
                        res();
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
            this.$content.find('form').on('submit', function (e) {
                e.preventDefault();
                jc.$$formSubmit.trigger('click');
            });
        }
    });
    return pro;
}


exports.init = init;
exports.name = ()=>name;
exports.gm = ()=>gm;