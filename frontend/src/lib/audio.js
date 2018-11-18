let sound = false;


function play(v, currentTime) {
    if(sound) sound.pause();
    sound = new Audio('audio/'+v);
    sound.loop=true;
    sound.currentTime = currentTime;
    sound.play();
}

window.play = play;
exports.play = play;
exports.mute = (mute)=>{
    if(sound) sound.muted = mute;
}
