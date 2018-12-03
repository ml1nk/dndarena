let params = false;

function query(obj) {
    if (!(obj instanceof Object)) {
        obj = params;
    }
    let str = [];
    for (let p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + (obj[p] !== null ? "=" + encodeURIComponent(obj[p]) : ""));
        }
    return str.join("&");
}


function obj() {
    if (!params) {
        params = _obj();
    }
    return params;
}

function _obj() {
    let paramArr = window.location.search.substring(1).split('&');
    let params = {};
    paramArr.forEach(function (e) {
        let param = e.split('=');
        if (param[0] !== "" || param.length !== 1) {
            params[decodeURIComponent(param[0])] = param.length === 1 ? null : decodeURIComponent(param[1]);
        }
    });
    return params;
}

function has(key) {
    obj();
    return params.hasOwnProperty(key);
}

function del(key) {
    if (!has(key)) {
        return false;
    }
    delete params[key];
    let get = query(params);
    history.replaceState({}, "", location.pathname + (get.length > 0 ? "?" + get : ""));
    return true;
}

function add(key, value) {
    obj();
    params[key] = value;
    let get = query();
    history.replaceState({}, "", location.pathname + (get.length > 0 ? "?" + get : ""));
    return true;
}


function get(key) {
    if (!has(key) || typeof params[key] !== "string") {
        return "";
    }
    return params[key];
}

exports.obj = obj;
exports.has = has;
exports.get = get;
exports.del = del;
exports.add = add;
exports.query = query;