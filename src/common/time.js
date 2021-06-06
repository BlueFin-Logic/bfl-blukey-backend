const moment = require('moment');

class Time {
    constructor(){
        this.formatTime = 'YYYY-MM-DD HH:mm:ss.SSS';
    }

    get getLatestTime(){
        return moment().format(this.formatTime);
    }

    get getLatestTimeUTC(){
        return moment.utc().format(this.formatTime);
    }

    formatTimeToString(data){
        return moment.utc(data).format(this.formatTime);
    }
}

module.exports.Time = new Time();