const moment = require('moment');
const simpleStats = require('simple-statistics');
const { roundToNearestHour } = require('../helpers/dateUtils');
const ItemStat = require('../models/itemStat');
const { weekdays, retentionPeriod } = require('../config/constants');
const winston = require('../config/winston');

const percentiles = [0.05, 0.25, 0.75, 0.95];

exports.findByRealmAndItemIdFilteredByTime = (realm, itemId, startTime, endTime) => ItemStat.find({
    realm,
    itemId,
    timestamp: {
        $gte: startTime,
        $lte: endTime,
    },
});


exports.saveItemStat = (itemId, itemStat, realm, timestamp) => {
    const weekday = weekdays[moment(timestamp).day()];
    const roundedTimestamp = roundToNearestHour(timestamp);

    const itemStatModel = new ItemStat({
        itemId,
        ...itemStat,
        timestamp,
        roundedTimestamp,
        weekday,
        realm,
    });

    return itemStatModel.save();
};

exports.deleteOldItemStats = async () => {
    try {
        const timeThreshold = moment.utc()
            .subtract(retentionPeriod, 'days')
            .startOf('day')
            .toDate();

        const { deletedCount } = await ItemStat.deleteMany({
            timestamp: {
                $lte: timeThreshold,
            },
        });

        winston.info(`deleted ${deletedCount} ItemStats document(s)`);
    } catch (error) {
        winston.error(error);
    }
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

    if (!itemCount) { // No auctions
        return {
            itemCount: 0,
            mean: 0,
            median: 0,
            max: 0,
            min: 0,
            mode: 0,
            percentile5: 0,
            percentile25: 0,
            percentile75: 0,
            percentile95: 0,
        };
    }

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
 * @param auctions array of auctions. The parameter must be an array of objects which
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
