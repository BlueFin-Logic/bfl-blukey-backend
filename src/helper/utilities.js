module.exports.parseInt = (input, defaultValue) => {
    var result = defaultValue;
    if (input) {
        try {
            result = parseInt(input);
        } catch (error) {
            console.log.error(`Error parsing '${input}'`, error);
        }
    }
    return result;
}