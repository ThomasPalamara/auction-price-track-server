const mongoose = require('mongoose');
const winston = require('../config/winston');

module.exports = function initConnexion() {
    mongoose.Promise = global.Promise;
    mongoose.set('useCreateIndex', true);

    return mongoose.connect(process.env.DB_STRING, { useNewUrlParser: true, keepAlive: true })
        .then(() => winston.info('Connected to MongoDB'))
        .catch((error) => {
            winston.error(error.message);
            process.exit(1);
        });

    // mongoose.connection.on('disconnected', () => {
    //     winston.error('Connection to MongoDB lost');
    //     process.exit(1);
    // });
};
