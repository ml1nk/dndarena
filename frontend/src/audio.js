const $ = require("jquery");
const io = require("./io.js");
const yurl = require('youtube-url');

let audio;
let mute = false;
let sound = false;

function init(me) {
    io.state.register(apply);

    $("#button-mute").show().click(() => {
        let icon = $("#button-mute .glyphicon");
        if (icon.hasClass("glyphicon-volume-off")) {
            if (sound) sound.muted = false;
            mute = false;
            icon.removeClass("glyphicon-volume-off").addClass("glyphicon-volume-up");
        } else if (icon.hasClass("glyphicon-volume-up")) {
            if (sound) sound.muted = true;
            mute = true;
            icon.removeClass("glyphicon-volume-up").addClass("glyphicon-volume-off");
        }
    });

    if(!me.gm) return;

    $("#button-play").show().click(() => {
        audio.play = $("#button-play span").hasClass("glyphicon-play");
        audio.time = (Date.now() / 1000) - audio.time;
        io.state.write("audio", audio);
    });

    $("#button-audio").show().click(() => {
        let data = false;
        $.confirm({
            title: 'Audio - YouTube',
            draggable: false,
            content: require("./audio.html"),
            buttons: {
                formSubmit: {
                    text: 'Save',
                    btnClass: 'btn-blue',
                    action: function () {
                        if (data) {
                            let id = this.$content.find('.youid').val();
                            let pos = this.$content.find('.beginslider').slider("value");
                            io.state.write("audio", {
                                data: data,
                                play: audio.play,
                                id: id,
                                time: audio.play ? (Date.now() / 1000) - pos : pos
                            });
                        } else {
                            io.state.write("audio", {
                                data: false,
                                play: audio.play,
                                id: "",
                                time: 0
                            });
                        }
                        return true;
                    }
                },
                cancel: {
                    text: 'Close'
                }
            },
            onContentReady: function () {
                let c = this.$content;
                let jc = this;

                c.find('.youid').on("input", function () {
                    let val = $(this).val();
                    if (yurl.valid(val)) {
                        val = yurl.extractId(val);
                        $(this).val(val);
                    }

                    if (!yurl.valid("https://www.youtube.com/watch?v=" + val)) {
                        c.find('.info').addClass("hidden");
                        return;
                    }

                    io.audio(val, res => {
                        if (res === false || $(this).val() !== val) return;

                        let begin = val === audio.id ? Math.round(audio.play ? (Date.now() / 1000) - audio.time : audio.time) : 0;
                        if (begin > res.duration) {
                            begin = res.duration;
                        }

                        c.find('.info').removeClass("hidden");
                        c.find('.title').text(res.title);
                        c.find('.duration').text(res.duration + "s");
                        c.find('.thumbnail').attr("src", res.thumbnail);
                        c.find('.beginslider').slider({
                            value: begin,
                            min: 0,
                            max: res.duration,
                            step: 1,
                            slide: (event, ui) => c.find('.begin').text(ui.value + "s")
                        })
                        c.find('.begin').text(begin + "s");
                        data = res;
                    });

                });

                if (audio.id) {
                    c.find('.youid').val(audio.id).trigger("input");
                }

                c.find('form').on('submit', (e) => {
                    e.preventDefault();
                    jc.$$formSubmit.trigger('click');
                });
                c.find('form').removeClass("hidden");

            }
        });
    });

}

function apply(key, _, obj) {
    if(key!=="audio")
        return;
    $("#button-play span")
        .removeClass(obj.play ? "glyphicon-play" : "glyphicon-pause")
        .addClass(obj.play ? "glyphicon-pause" : "glyphicon-play");
    if (obj.play && obj.id !== "") {
        if (sound) sound.pause();
        sound = new Audio(obj.data.url);
        if (mute) sound.muted = true;
        sound.currentTime = (Date.now() / 1000) - obj.time;
        sound.play();
        window.sound = sound;
    } else {
        if (sound) sound.pause();
    }
    audio = obj;
}

exports.init = init;

