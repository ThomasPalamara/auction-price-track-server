const itemService = require('../services/item.srv');
const realmService = require('../services/realm.srv');

exports.storeItems = (req, res) => {
    const start = req.query.start || 1;
    const end = req.query.end || 10000;

    itemService.processWowItems(start, end);

    //Since it may take too much time to process every items, we only respond when the process has started and not when it's over.
    res.send({message: "Initialization of items started"});
};

exports.storeRealms =  (req, res) => {
    realmService.processRealms();

    //Since it may take too much time to process every realms, we only respond when the process has started and not when it's over.
    res.send({message: "Initialization of realms started"});
};