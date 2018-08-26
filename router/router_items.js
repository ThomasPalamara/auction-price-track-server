const router = require('express').Router();
const winston = require('../winston');
const Item = require("../model/item");

router.get('/items', async (req, res) => {
    try {
        const items = await fetchItems();

        res.json(items);
    }
    catch (error) {
        winston.error('Error unknown : ' + error);

        res.statusCode = 500;
        res.send({message : 'Something bad happened'});
    }
});

const fetchItems = () => {
    return Item.find();
};

module.exports = router;