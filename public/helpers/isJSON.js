module.exports = function isJson(item) {
    if(typeof item === 'object') {
        return false;
    }

    item = typeof item !== "string"
        ? JSON.stringify(item)
        : item;

    try {
        item = JSON.parse(item);
    } catch (e) {
        return false;
    }

    return true;
}
