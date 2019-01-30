const simpleStats = require('simple-statistics');
const ItemStat = require('../models/itemStat');

const percentiles = [0.05, 0.25, 0.75, 0.95];

exports.findByRealmAndItemId = (realm, itemId, start, end) => ItemStat.find({
    realm,
    itemId,
    timestamp: {
        $gte: start,
        $lte: end,
    },
});


exports.saveItemStat = (itemId, itemStat, realm, timestamp) => {
    const itemStatModel = new ItemStat({
        itemId,
        ...itemStat,
        timestamp,
        realm,
    });

    return itemStatModel.save();
};

/**
 * Compute statistics for all auctions in arguments
 * @param auctions array of auctions. The parameter must be an array objects which
 *  all have the properties unitPrice and quantity
 * @return an object containing the average price, max price and min price
 */
exports.computeStats = (auctions) => {
    const prices = transformToNumberArray(auctions);

    const itemCount = prices.length;
    const mean = Math.round(simpleStats.mean(prices));
    const median = simpleStats.median(prices);
    const mode = simpleStats.mode(prices);
    const max = simpleStats.max(prices);
    const min = simpleStats.min(prices);
    const [
        percentile5,
        percentile25,
        percentile75,
        percentile95,
    ] = simpleStats.quantile(prices, percentiles);

    return {
        itemCount,
        mean,
        median,
        max,
        min,
        mode,
        percentile5,
        percentile25,
        percentile75,
        percentile95,
    };
};

/**
 * Transform the auctions' array into an array of Number containing all the prices
 * @param auctions array of auctions. The parameter must be an array objects which
 *  all have the properties unitPrice and quantity
 * @return a simple number array containing all prices
 */
const transformToNumberArray = (auctions) => {
    const prices = [];

    auctions.forEach((auction) => {
        for (let i = 0; i < auction.quantity; i++) {
            prices.push(auction.unitPrice);
        }
    });

    return prices;
};
