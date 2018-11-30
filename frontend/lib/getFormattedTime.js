function getFormattedTime() {
    let today = new Date();
    let y = today.getFullYear();
    let m = today.getMonth() + 1;
    let d = today.getDate();
    let h = today.getHours();
    let mi = today.getMinutes();
    return h + "_" + mi + "__" + d + "_" + m + "_" + y;
}

module.exports = getFormattedTime;