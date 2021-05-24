const objectMapper = require('object-mapper');

class ObjectMapper {
    static map(source, schema) {
        try {
            return objectMapper(source, schema);
        } catch (err) {
            throw err
        }
    }
}

module.exports = ObjectMapper