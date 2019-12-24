const $ = require('jquery');
require('bootstrap');
require('bootstrap/dist/css/bootstrap.css');
const io = require('./io.js');

function init(me){
    $("#button-chat").show();
    $('#chatbox').show();
    $("#txtsendtext").keyup((e)=>{if (e.keyCode === 13) $("#btnchat").click()});
    $('#btnchat').click(()=>{
        let value = $('#txtsendtext').val();
        $("#txtsendtext").val('');
        io.message.out(me.name + ": " + value);
        add(me.name + ": " + value, true);
    });
    io.message.in(text=>add(text, false));
}

function add(text, own) {
    if(!own && $("#collapseOne.in").length===0 && $("#button-chat").css("color")!=="orange") {
        $("#button-chat").css("color","orange");
        $("#button-chat").one("click",()=>$("#button-chat").css("color","white"));
    }
    let $newMsg = $("<li></li>");
    $("#chat").append($newMsg);
    $newMsg.text(text);
}

exports.init = init;