const appRoot = require('app-root-path');
const winston = require('winston');

const consoleFormat = winston.format.printf(({timestamp, level, message}) => {
    return `${timestamp} - ${level}: ${message}`;
});

const logger = winston.createLogger({
    level: 'debug',
    transports: [
        new winston.transports.Console(),
    ],
    format: winston.format.combine(
        winston.format.timestamp(),
        consoleFormat,
    ),
});


module.exports = logger;
