const moment = require('moment');
const formatTime = 'YYYY-MM-DD HH:mm:ss.SSS';

module.exports.getLatestTime = () => {
    try {
        return moment().format(formatTime);
    } catch (err) {
        throw err
    }
}

module.exports.getLatestTimeUTC = () => {
    try {
        return moment.utc().format(this.formatTime);
    } catch (err) {
        throw err
    }
}

module.exports.getCurrentUnixTimestamp = () => {
    try {
        return moment().valueOf();
    } catch (err) {
        throw err
    }
}

module.exports.formatTimeUTCToString = (data) => {
    try {
        return moment.utc(data).format(formatTime);
    } catch (err) {
        throw err
    }
}

