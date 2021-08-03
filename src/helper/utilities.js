module.exports.parseInt = (input, defaultValue) => {
    let result = defaultValue;
    if (input) {
        try {
            result = parseInt(input);
            if (isNaN(result)) result = defaultValue;
        } catch (error) {
            console.log.error(`Error parsing '${input}'`, error);
        }
    }
    return isNaN(result) ? defaultValue : result;
}