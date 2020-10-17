module.exports.smartTrim = (value, length = 150, delim = " ", sub = "...") => {
    if(!value || typeof value !== 'string') return;
    if(value.length <= length) return value;
    let text = value.substr(0, length);
    let lastWordIndex = text.lastIndexOf(delim);
    if(lastWordIndex > 0) {
        text = text.substr(0, lastWordIndex);
        return text +' '+ sub;
    }
    return;
}