const $ = require('jquery');
require('jquery-ui/ui/widgets/button');
require('jquery-ui/themes/base/theme.css');
require('jquery-ui/themes/base/button.css');
const io = require('./io.js');
const download = require('./download.js');
const upload = require('./upload.js');
const sound = require('./audio.js');

function init() {
    $("#button-chat").show();
    $("#button-mute").show().click(()=>{
        let icon = $("#button-mute .glyphicon");
        if(icon.hasClass("glyphicon-volume-off")) {
            sound.mute(false);
            icon.removeClass("glyphicon-volume-off").addClass("glyphicon-volume-up");
        } else if(icon.hasClass("glyphicon-volume-up")) {
            sound.mute(true);
            icon.removeClass("glyphicon-volume-up").addClass("glyphicon-volume-off");
        }
    });
    $("#button-load").show().click(async ()=>{
        try {
            let res = await upload(".dnd");
            let data = JSON.parse(res);
            io.load(data);
        } catch(e) {}
    });

    $("#button-save").show().click(()=>{
        download('map_'+getFormattedTime()+'.dnd', 'text/plain', JSON.stringify(io.state()));
    });
}

exports.init = init;

function getFormattedTime() {
    var today = new Date();
    var y = today.getFullYear();
    var m = today.getMonth() + 1;
    var d = today.getDate();
    var h = today.getHours();
    var mi = today.getMinutes();
    return h + "_" + mi + "__" + d + "_" + m + "_" + y;
}