const ItemStat = require("../models/itemStat");

exports.findByRealmAndItemId = (realm, itemId, start, end) => {
    return ItemStat.find({
        'realm' : realm,
        'itemId' : itemId,
        'timestamp' : {
           '$gte': start,
           '$lte': end
        }
    });
};

exports.saveItemStat = (itemId, itemStat, realm, timestamp) => {
    const itemStatModel = new ItemStat({
        itemId: itemId,
        ...itemStat,
        timestamp: timestamp,
        realm: realm,
    });

    return itemStatModel.save();
};

/**
 * Compute statistics for all auctions in arguments
 * @param auctions array of auctions. The parameter must be an array objects which all have the properties unitPrice and quantity
 * @return an object containing the average price, max price and min price
 */
exports.computeStats = auctions => {
    let quantity = 0;
    let sum = 0;

    let minPrice = auctions[0].unitPrice;
    let maxPrice = 0;

    auctions.forEach(auction => {
        quantity += auction.quantity;
        sum += auction.unitPrice * auction.quantity;

        if (auction.unitPrice < minPrice ){
            minPrice = auction.unitPrice;
        }

        if (auction.unitPrice > maxPrice ){
            maxPrice = auction.unitPrice;
        }
    });

    const averagePrice =  sum / quantity;

    return { minPrice, averagePrice, maxPrice };
};
