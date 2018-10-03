const Item = require("../models/item");
const rp = require('request-promise');
const constants = require('../config/constants');
const winston = require('../config/winston');

exports.findAll = () => {
    return Item.find();
};

exports.storeItem = async (itemId) => {
    try {
        const itemPromise = fetchItem(itemId);
        const itemFrPromise = fetchItemFr(itemId);

        const [item, itemFr] = await Promise.all([itemPromise, itemFrPromise]);

        const savedItem = await saveItem(item, itemFr);

        winston.debug(`Saved item ${savedItem.name_fr}`);

        return savedItem;
    }
    catch (error) {
        logItemError(error, itemId);

        throw error;
    }
};

exports.findByBlizzardId = async (blizzardId) => {
    return Item.findOne({ blizzardId: blizzardId });
};


exports.cleanItemCollection = async () => {
    await Item.remove({});
};

const fetchItem = async (itemId) => {
    return rp(`${constants.blizzardURL}/item/${itemId}?locale=en_GB&apikey=${constants.apiKey}`, { json: true });
};

const fetchItemFr = async (itemId) => {
    return rp(`${constants.blizzardURL}/item/${itemId}?locale=fr_FR&apikey=${constants.apiKey}`, { json: true });
};

const saveItem = async (item, itemFr) => {
    const itemModel = new Item({
        blizzardId: item.id,
        name: item.name,
        name_fr: itemFr.name,
    });

    return await itemModel.save();
};

const logItemError = (error, itemId) => {
    if (error.statusCode === 404) {
        winston.error(`Item ${itemId} not found`);
    } else if (error.statusCode === 403) {
        winston.error(`API limits' reached for item ${itemId}`);
    } else {
        winston.error('Error unknown for item ' + itemId + ' : ' + error);
    }
};
