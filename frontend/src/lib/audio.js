const $ = require("jquery");
const io = require("./io.js");

let sound = false;
let _id = "";
let _time = 0;

function set(play, id, time) {
    _id = id;
    _time = time;
    if(play && id !== "") start(id, (Date.now()/1000)-time); 
}

function start(v, currentTime) {
    if(sound) sound.pause();
    sound = new Audio('audio/'+v);
    sound.loop=true;
    sound.currentTime = currentTime;
    sound.play();
}

$("#button-audio").click(()=>{
    $.confirm({
        title: 'Audio - YouTube',
        draggable: false,
        content: '' +
        '<form class="formName">' +
        '<div class="form-group"><br/>' +
        '<input type="text" placeholder="YouTube v=" class="youid form-control"/><br/>' +
        '<input type="number" placeholder="Position in seconds" class="youpos form-control"/>' +
        '</div>' +
        '</form>',
        buttons: {
            formSubmit: {
                text: 'Save',
                btnClass: 'btn-blue',
                action: function() {
                    let id = this.$content.find('.youid').val();
                    let pos = this.$content.find('.youpos').val();
                    io.audio.set(id, (Date.now()/1000)-pos);
                    return true;
                }
            }
        },
        onContentReady: function () {
            this.$content.find('.youid').val(_id);
            this.$content.find('.youpos').val(_time===0 ? 0 : (Date.now()/1000)-_time);
            var jc = this;
            this.$content.find('form').on('submit', (e)=> {
                e.preventDefault();
                jc.$$formSubmit.trigger('click');
            });
        }
    });
});


exports.set = set;
exports.mute = (mute)=>{
    if(sound) sound.muted = mute;
}
