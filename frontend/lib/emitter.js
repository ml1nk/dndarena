const particles = require('pixi-particles');
const autoremoveDelay = 10000;
const emitterSpeed = 2;

function emitter(viewport) {

    let data = {};
    let count = 0;
    let elapsed;

    function rm(key) {
        if(!Object.prototype.hasOwnProperty.call(data, key))
            return false;
        data[key].emitter.destroy();
        clearTimeout(data[key].autoremove);
        delete data[key];
        count--;
        return true;
    }
    
    function move(key, x, y) {
        if(!Object.prototype.hasOwnProperty.call(data, key))
            return false;
        data[key].destPos = {
            x : x,
            y : y
        };
        clearTimeout(data[key].autoremove);
        data[key].autoremove = _autoremove(key);
        return true;
    }
    
    function add(key, x, y, images, config) {
        if(Object.prototype.hasOwnProperty.call(data, key))
            return false;
        const emitter = new particles.Emitter(viewport, images, config);
        emitter.updateOwnerPos(x, y);
        emitter.emit = true;
        data[key] = {
            emitter : emitter,
            autoremove : _autoremove(),
            currentPos : {
                x : x,
                y : y
            },
            destPos : {
                x : x,
                y : y
            }
        };
        count++;
        if (count === 1) {
            elapsed = Date.now();
            _update();
        }
        return true;
    }

    function _autoremove(key) {
        return setTimeout(()=>rm(key), autoremoveDelay);
    }

    function _update() {
        let empty = true;
        let now = Date.now();
        for (const key in data) {
            let obj = data[key];
            empty = false;
            let x = obj.destPos.x-obj.currentPos.x;
            let y = obj.destPos.y-obj.currentPos.y;
            if(x!==0 || y!==0) {
                let factor = Math.min(((now - elapsed) * emitterSpeed)/Math.sqrt(x*x+y*y), 1);
                obj.currentPos.x += x*factor;
                obj.currentPos.y += y*factor;
                obj.emitter.updateOwnerPos(obj.currentPos.x, obj.currentPos.y);
            }
            obj.emitter.update((now - elapsed) * 0.001);
        }
        if (empty) return;
        elapsed = now;
        requestAnimationFrame(_update);
    }

    return {
        rm : rm,
        move : move,
        add : add
    }
}

module.exports = emitter;