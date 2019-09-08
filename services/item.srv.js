const Item = require("../models/item");
const blizzardAPI = require("../helpers/blizzardAPI");
const winston = require("../config/winston");

exports.findAll = () => Item.find();

exports.findAllBlizzardIds = () => Item.find().select("blizzardId -_id");

exports.storeItem = async itemId => {
  try {
    const itemPromise = blizzardAPI.fetchItem(itemId);
    const itemFrPromise = blizzardAPI.fetchItemFR(itemId);

    const [item, itemFr] = await Promise.all([itemPromise, itemFrPromise]);

    const savedItem = await saveItem(item, itemFr);

    winston.debug(`Saved item ${savedItem.name_fr}`);

    return savedItem;
  } catch (error) {
    logItemError(error, itemId);

    throw error;
  }
};

exports.findByBlizzardId = blizzardId => Item.findOne({ blizzardId });

exports.cleanItemCollection = async () => {
  await Item.remove({});
};

const saveItem = async (item, itemFr) => {
  const itemModel = new Item({
    blizzardId: item.id,
    name: item.name,
    name_fr: itemFr.name
  });

  return itemModel.save();
};

const logItemError = (error, itemId) => {
  if (error.statusCode === 404) {
    winston.error(`Item ${itemId} not found`);
  } else if (error.statusCode === 403) {
    winston.error(`API limits' reached for item ${itemId}`);
  } else {
    // Error object is not displayed beautifully when using string templates
    // eslint-disable-next-line prefer-template
    winston.error("Error unknown for item " + itemId + " : " + error);
  }
};
