const Item = require("../models/item");
const rp = require('request-promise');
const config = require('../config');
const winston = require('../winston');

exports.findAll = () => {
    return Item.find();
};

exports.processWowItems = (itemId, maxItemId) => {
    processItem(itemId);

    itemId++;

    //Pessimistic management of blizzard API usage limits
    if (itemId % 18000 === 0) {
        //We wait a bit more than 1 hour for safety
        return setTimeout(() => exports.processWowItems(itemId, maxItemId), 3602000);
    }
    if (itemId % 50 === 0) {
        return setTimeout(() => exports.processWowItems(itemId, maxItemId), 2000);
    }
    if (itemId <= maxItemId) {
        return exports.processWowItems(itemId, maxItemId);
    }
};

const processItem = async (itemId) => {
    try {
        const item = await fetchItem(itemId);

        //We only save items that are marketable
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

const logItemError = (error, itemId) => {
    if (error.statusCode === 404) {
        winston.info(`Item ${itemId} not found`);
    } else if (error.statusCode === 403) {
        winston.error(`API limits' reached for item ${itemId}`);
    } else {
        winston.error('Error unknown for item ' + itemId + ' : ' + error);
    }
};

