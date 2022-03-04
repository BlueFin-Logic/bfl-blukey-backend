const winston = require('winston');

exports.configWinston = function(fileName) {
  let configs = {
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { fileName: fileName, time: new Date() },
    transports: [
      new winston.transports.File({ filename: 'logs/error.log', level: 'error', timestamp: true }),
      new winston.transports.File({ filename: 'logs/info.log', level: 'info', timestamp: true }),
    ],
  }
  return winston.createLogger(configs);
} 
