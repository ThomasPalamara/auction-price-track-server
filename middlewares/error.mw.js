const winston = require('../config/winston');

module.exports = (error, req, res, next) => {
    winston.error(error.message);
    res.status(500).send({ message: 'Unfortunate things happened' });
};
