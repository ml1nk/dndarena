module.exports = () => {
    const state = {};
    const states = {};
    const active = {};

    function register(name, enter, leave) {
        if(Object.prototype.hasOwnProperty.call(states, name))
            console.warn("state is already registered");
        states[name] = { enter : enter, leave : leave};

    }

    function transition(leaves, enters) {
        for(let leave in leaves) {
            if(Object.prototype.hasOwnProperty.call(active, leave)) {
                console.info("leave", leave)
                delete active[leave];
                states[leave].leave(state);
            }
        }
        for(let enter in enters) {
            if(!Object.prototype.hasOwnProperty.call(active, enter)) {
                console.info("enter", enter)
                active[enter] = null;
                states[enter].enter(state);
            }
        }
    }

    return {
        register : register,
        transition : transition
    }
}