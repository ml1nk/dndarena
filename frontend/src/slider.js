const $ = require('jquery');
require('jquery-ui/ui/widgets/slider');
require('jquery.ui.touch/jquery.ui.touch.js');
require('jquery-ui/themes/base/theme.css');
require('jquery-ui/themes/base/slider.css');
const pixi = require('./pixi.js');

function init() {
    $( "#slider-rotate" ).slider({
        orientation: "vertical",
        value: 180,
        min: 0,
        max: 360,
        step: 10
    }).on( "slide", ( event, ui ) => {
        pixi.v.rotation = (ui.value-180)/360*2*Math.PI;
    });
    $("#slider-rotate .ui-slider-handle").addTouch();
}

exports.init = init;
