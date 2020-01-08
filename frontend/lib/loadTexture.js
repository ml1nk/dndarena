const PIXI = require('pixi.js');

function loadTexture(context) {
    // ToDo Use Loader.shared
    const loader = new PIXI.Loader();
    context.keys().forEach(
        (key)=>loader.add(key.slice(2, -4), context(key).default)
    );
    return new Promise((resolve) => {
        loader.load((_, resources) => {
            const textures = {};
            for (let key in resources) {
                textures[key] = resources[key].texture;
            }
            resolve(textures);
        });
    });
}

module.exports = loadTexture;