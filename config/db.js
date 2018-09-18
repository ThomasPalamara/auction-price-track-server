const mongoose = require('mongoose');
const constants = require('./constants');
const winston = require('./winston');

module.exports = function initConnexion() {
    mongoose.Promise = global.Promise;

    mongoose.connect(constants.dbURL, { useNewUrlParser: true, keepAlive: true })
        .then( () => winston.info('Connected to MongoDB') )
        .catch( (error) => {
            winston.error(error.message);
            process.exit(1);
        });

    // mongoose.connection.on('disconnected', () => {
    //     winston.error('Connection to MongoDB lost');
    //     process.exit(1);
    // });
}

