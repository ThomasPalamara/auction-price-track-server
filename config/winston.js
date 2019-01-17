const winston = require('winston');

const customFormat = winston.format.printf(({timestamp, level, message}) => {
    return `${timestamp} - ${level}: ${message}`;
});

const logger = winston.createLogger({
    level: 'debug',
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
        // new winston.transports.File({
        //     filename: 'logs/server.log',
        //     maxsize: 5242880, // 5MB
        //     maxFiles: 10,
        //     format: winston.format.combine(
        //         winston.format.timestamp(),
        //         customFormat,
        //     ),
        // })
    ]
});


module.exports = logger;
