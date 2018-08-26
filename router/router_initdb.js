const rp = require('request-promise');
const router = require('express').Router();
const winston = require('../winston');
const config = require('../config');
const Item = require("../model/item");
const Realm = require("../model/realm");

router.get('/initdb/items', (req, res) => {
    const start = req.query.start || 1;
    const end = req.query.end || 10000;

    processItems(start, end);

    //Since it may take too much time to process every items, we only respond when the process has started and not when it's over.
    res.send({message: "Initialization of items started"});
});

router.get('/initdb/items', (req, res) => {
    const start = req.query.start || 1;
    const end = req.query.end || 10000;

    processItems(start, end);

    //Since it may take too much time to process every items, we only respond when the process has started and not when it's over.
    res.send({message: "Initialization of items started"});
});

router.get('/initdb/realms', async (req, res) => {
    //Since it may take too much time to process every realms, we only respond when the process has started and not when it's over.
    res.send({message: "Initialization of realms started"});

    try{
        const realms = (await fetchRealms()).realms;

        for (let index = 0; index < realms.length; index++) {
            let realm = realms[index];

            processRealm(realm);
        }
    }
    catch (error) {
        winston.error('Error unknown : ' + error);
    }
});

const processItems = (itemId, maxItemId) => {
    processItem(itemId);

    itemId++;

    if (itemId % 18000 === 0) {
        //We wait a bit more than 1 hour for safety
        return setTimeout(() => processItems(itemId, maxItemId), 3602000);
    }
    if (itemId % 50 === 0) {
        return setTimeout(() => processItems(itemId, maxItemId), 2000);
    }
    if (itemId <= maxItemId) {
        return processItems(itemId, maxItemId);
    }
};

const processItem = async (itemId) => {
    try {
        const item = await fetchItem(itemId);

        //We only save items that are sellable
        if(item.isAuctionable){
            const itemFr = await fetchItemFr(itemId);
            
            const savedItem = await saveItem(item, itemFr);

            winston.info(`Found and saved: ${JSON.stringify(savedItem)}`);
        }
        else{
            winston.info(`Found but not saved: ${itemId}`);
        }
    }
    catch (error) {
        logItemError(error, itemId);
    }
};

const processRealm = async (realm) => {
    try {
        if (realm.locale === "fr_FR") {
            const savedRealm = await saveRealm(realm);
            winston.info(`Found and saved: ${JSON.stringify(savedRealm)}`);
        }
    }
    catch (error) {
        winston.error('Error unknown for realm ' + realm.slug + ' : ' + error);
    }
};

const fetchItem = (itemId) => {
    return rp(`${config.blizzardURL}/item/${itemId}?locale=en_GB&apikey=${config.apiKey}`, {json: true});
};

const fetchItemFr = (itemId) => {
    return rp(`${config.blizzardURL}/item/${itemId}?locale=fr_FR&apikey=${config.apiKey}`, {json: true});
};

const saveItem = (item, itemFr) => {
    const itemModel = new Item({
        id: item.id,
        name: item.name,
        name_fr: itemFr.name,
    });

    return itemModel.save();
};

const fetchRealms = () => {
    return rp(`${config.blizzardURL}/realm/status?locale=en_GB&apikey=${config.apiKey}`, {json: true})
};

const saveRealm = (realm) => {
    const realmModel = new Realm({
        value: realm.slug,
        label: realm.name,
    });

    return realmModel.save();
};

const logItemError = (error, itemId) => {
    if (error.statusCode === 404) {
        winston.info(`Item ${itemId} not found`);
    } else if (error.statusCode === 403) {
        winston.error(`API limits' reached for item ${itemId}`);
    } else {
        winston.error('Error unknown for item ' + itemId + ' : ' + error);
    }
};

module.exports = router;
