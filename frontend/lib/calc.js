// https://www.redblobgames.com/grids/hexagons/

const hexagon = require('./../config.json').hexagon;

const c = Math.PI/6;
const height = hexagon.radius * Math.sqrt(3);
const pol = [
    -hexagon.radius, 0,
    -hexagon.radius/2, height/2,
    hexagon.radius/2, height/2,
    hexagon.radius, 0,
    hexagon.radius/2, -height/2,
    -hexagon.radius/2, -height/2,
    -hexagon.radius, 0
];

const Z = {
    x : -(hexagon.radius-hexagon.border/2)*Math.cos(-2*c),
    y : -(hexagon.radius-hexagon.border/2)*Math.sin(-2*c)
}
const X = {
    x : -(hexagon.radius-hexagon.border/2)*Math.cos(-6*c),
    y : -(hexagon.radius-hexagon.border/2)*Math.sin(-6*c)
}
const Y = {
    x : -(hexagon.radius-hexagon.border/2)*Math.cos(2*c),
    y : -(hexagon.radius-hexagon.border/2)*Math.sin(2*c)
}

function pixel_to_cube(x, y) {
    let q = (2/3*x)/(hexagon.radius-hexagon.border/2);
    let r = (-1/3*x+Math.sqrt(3)/3*y)/(hexagon.radius-hexagon.border/2);
    let [cx,cy,cz] = axial_to_cube(q, r);
    return cube_round(cx,cy,cz);
}

function cube_to_pixel(x,y,z) {
    return {
        x : X.x*x+Y.x*y+Z.x*z,
        y : X.y*x+Y.y*y+Z.y*z
    }
}

function axial_to_cube(q, r) {
    let x = q;
    let z = r;
    let y = -x-z;
    return [x, y, z]
}

function cube_round(x, y, z) {
    let rx = Math.round(x);
    let ry = Math.round(y);
    let rz = Math.round(z);

    let x_diff = Math.abs(rx - x);
    let y_diff = Math.abs(ry - y);
    let z_diff = Math.abs(rz - z);

    if(x_diff > y_diff && x_diff > z_diff) {
        rx = -ry-rz;
    } else if (y_diff > z_diff) {
        ry = -rx-rz;
    } else {
        rz = -rx-ry;
    }
    return [rx, ry, rz];
}

function to(x, y, z) {
    return x+":"+y+":"+z
}

function from(val) {
    let [x, y, z] = val.split(":");
    return [parseInt(x),parseInt(y), parseInt(z)];
}

exports.pixel_to_cube = pixel_to_cube;
exports.cube_to_pixel = cube_to_pixel;
exports.to = to;
exports.from = from;
exports.pol = ()=>pol;
exports.height = ()=>height;