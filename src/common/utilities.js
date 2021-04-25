class Utilities {
    isEmpty(obj) {
        if (typeof obj === 'undefined' || obj === null) {
            return true;
        }
        return obj.length === 0;
    }

    parseInt(input, defaultValue) {
        var result = defaultValue;
        if (input) {
            try {
                result = parseInt(input);
            } catch (error) {
                //console.log.error(`Error parsing '${input}'`, error);
            }
        }
        return result
    }

    parseJSON(input, defaultValue) {
        var result = defaultValue;
        if (input) {
            try {
                result = JSON.parse(input);
            } catch (error) {
                //console.log.error(`Error parsing '${input}'`, error);
            }
        }
        return result
    }

    isObject(p) {
        return (p != null && typeof p === 'object');
    }
}

module.exports.Utilities = new Utilities();