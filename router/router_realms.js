const router = require('express').Router();
const winston = require('../winston');
const Realm = require("../model/realm");

router.get('/realms', async (req, res) => {
    try{
        const realms = await fetchRealms();

        res.json(realms);
    }
    catch (error) {
        winston.error('Error unknown : ' + error);

        res.statusCode = 500;
        res.send({message : 'Something bad happened'});
    }
});

const fetchRealms = () => {
    return Realm.find();
};

module.exports = router;