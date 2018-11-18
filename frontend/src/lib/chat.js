const $ = require('jquery');
require('bootstrap');
require('bootstrap/dist/css/bootstrap.css');
const input = require('./input.js');
const io = require('./io.js');

function init(){
    $('#chatbox').show();
    $("#txtsendtext").keyup((e)=>{if (e.keyCode === 13) $("#btnchat").click()});
    $('#btnchat').click(()=>{
        let value = $('#txtsendtext').val();
        $("#txtsendtext").val('');
        io.message(input.name() + ": " + value);
    });
}


function add(text, so=true) {
    if(so===false && $("#collapseOne.in").length===0 && $("#button-chat").css("color")!=="orange") {
        $("#button-chat").css("color","orange");
        $("#button-chat").one("click",()=>$("#button-chat").css("color","white"));
    };
    let $newMsg = $("<li></li>");
    $("#chat").append($newMsg);
    $newMsg.text(text);
}

exports.init = init;
exports.add = add;