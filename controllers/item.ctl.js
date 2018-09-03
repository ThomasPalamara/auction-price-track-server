const itemService = require('../services/item.srv');
const winston = require('../winston');

exports.getItems = async (req, res) => {
    try {
        const items = await itemService.findAll();

        res.json(items);
    }
    catch (error) {
        winston.error('Error unknown : ' + error);

        res.statusCode = 500;
        res.send({message : 'Something bad happened'});
    }
};