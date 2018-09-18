const winston = require('winston');

const consoleFormat = winston.format.printf(({timestamp, level, message}) => {
    return `${timestamp} - ${level}: ${message}`;
});

const logger = winston.createLogger({
    level: 'debug',
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ 
            filename: 'log/server.log',
            maxsize: 5242880, // 5MB
            maxFiles: 10,
        })
    ],
    format: winston.format.combine(
        winston.format.timestamp(),
        consoleFormat,
    ),
});


module.exports = logger;
