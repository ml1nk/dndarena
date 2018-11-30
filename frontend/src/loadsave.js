const $ = require('jquery');
require('jquery-ui/ui/widgets/button');
require('jquery-ui/themes/base/theme.css');
require('jquery-ui/themes/base/button.css');
const io = require('./io.js');
const download = require('../lib/download.js');
const upload = require('../lib/upload.js');
const getFormattedTime = require('../lib/getFormattedTime.js');

function init(me) {
    if(!me.gm) return;

    $("#button-load").show().click(async ()=>{
        try {
            let res = await upload(".dnd");
            let data = JSON.parse(res);
            io.state.set("",data);
        } catch(e) {}
    });

    $("#button-save").show().click(()=>{
        download('map_'+getFormattedTime()+'.dnd', 'text/plain', JSON.stringify(io.state.get()));
    });

}

exports.init = init;

