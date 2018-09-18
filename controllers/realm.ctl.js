const realmService = require('../services/realm.srv');

exports.getRealms = async (req, res) => {
    const realms = await realmService.findAll();

    res.json(realms);
};