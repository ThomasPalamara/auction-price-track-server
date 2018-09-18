const realmService = require('../services/realm.srv');
const winston = require('../config/winston');

exports.getRealms = async (req, res) => {
    try{
        const realms = await realmService.findAll();

        res.json(realms);
    }
    catch (error) {
        winston.error('Error unknown : ' + error);

        res.statusCode = 500;
        res.send({message : 'Something bad happened'});
    }
};