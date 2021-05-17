const moment = require('moment');

class Time {
    constructor(){
        this.formatTime = 'YYYY-MM-DD hh:mm:ss.SSS';
    }

    get getLatestTime(){
        return moment.utc().format(this.formatTime);
    }

    formatTimeToString(data){
        return moment.utc(data).format(this.formatTime);
    }
}

module.exports.Time = new Time();