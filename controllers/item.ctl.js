const itemService = require('../services/item.srv');

exports.getItems = async (req, res) => {
    const items = await itemService.findAll();

    res.json(items);
};