const AuctionData = require('../models/auctionData');
const AuctionInformation = require('../models/auctionInformation');
const blizzardAPI = require('../helpers/blizzardAPI');
const itemService = require('./item.srv');
const itemStatService = require('./itemstat.srv');
const realmService = require('./realm.srv');
const winston = require('../config/winston');

exports.findByRealmAndItemId = (realm, itemId, start, end) => AuctionData.find({
    realm,
    itemId,
    timestamp: {
        $gte: start,
        $lte: end,
    },
});

exports.refreshAuctionsData = async () => {
    try {
        const realms = await realmService.findAll();
        let realm = null;

        for (let i = 0; i < realms.length; i++) {
            realm = realms[i];

            winston.info(`updating realm ${realm.slug}...`);
            // Auctions are processed synchronously so the RAM limit of heroku is not exceeded
            // eslint-disable-next-line no-await-in-loop
            await fetchAndSaveAuctionsData(realm.slug);
            winston.info(`realm ${realm.slug} finished`);
        }

        winston.info('---------------All auctions are up to date---------------');
    } catch (error) {
        winston.error(error);
    }
};

const fetchAndSaveAuctionsData = async (realm) => {
    // || {} prevents an error from occuring when destructuring an undefined value
    const { lastSaved } = await getLastSavedDate(realm) || {};

    const { url, lastModified } = (await blizzardAPI.fetchRealmAuctionsUrl(realm)).files[0];

    if (lastSaved && lastSaved.getTime() === lastModified) {
        winston.info(`Auctions for realm ${realm} are already up to date`);

        return null;
    }

    const { auctions } = await blizzardAPI.fetchAuctions(url);

    const aggregatedAuctions = await aggregateByItem(auctions, realm, lastModified);

    await computeAndSaveStats(aggregatedAuctions, realm, lastModified);

    return updateLastSavedDate(lastModified, realm);
};

const getLastSavedDate = realm => AuctionInformation.findOne({ realm });

const updateLastSavedDate = async (date, realm) => {
    let auctionInformation = await getLastSavedDate(realm);

    if (auctionInformation) {
        auctionInformation.lastSaved = date;
    } else {
        auctionInformation = new AuctionInformation({
            realm,
            lastSaved: date,
        });
    }

    return auctionInformation.save();
};

const aggregateByItem = async (auctions, realm, timestamp) => {
    const aggregatedAuctions = {};

    const blizzardIds = await itemService.findAllBlizzardIds();
    const itemIds = formatIds(blizzardIds);

    auctions.forEach((auction) => {
        if (auction.buyout > 0 && itemIds.includes(auction.item)) {
            const unitPrice = Math.round(auction.buyout / auction.quantity);

            if (!aggregatedAuctions[auction.item]) {
                aggregatedAuctions[auction.item] = [];
            }

            const existingAuctionData = aggregatedAuctions[auction.item]
                .find(auctionData => auctionData.unitPrice === unitPrice);

            if (!existingAuctionData) {
                aggregatedAuctions[auction.item].push({
                    unitPrice,
                    quantity: auction.quantity,
                });
            } else {
                existingAuctionData.quantity += auction.quantity;
            }
        }
    });

    // At the moment, auctions are stored but we don't know yet if it will be used
    saveAuctions(aggregatedAuctions, realm, timestamp);

    return aggregatedAuctions;
};

const computeAndSaveStats = async (aggregatedAuctions, realm, timestamp) => {
    const promises = [];

    Object.entries(aggregatedAuctions).forEach(([itemId, itemAuctions]) => {
        const itemStat = itemStatService.computeStats(itemAuctions);

        promises.push(itemStatService.saveItemStat(itemId, itemStat, realm, timestamp));
    });

    return Promise.all(promises);
};

const saveAuctions = (aggregatedAuctions, realm, timestamp) => {
    Object.entries(aggregatedAuctions).forEach(([itemId, itemAuctions]) => {
        saveAuction(itemId, itemAuctions, realm, timestamp);
    });
};

const saveAuction = (itemId, auctionData, realm, timestamp) => {
    const auctionDataModel = new AuctionData({
        itemId,
        auctions: auctionData,
        timestamp,
        realm,
    });

    auctionDataModel.save();
};

const formatIds = (blizzardIds) => {
    const formatedResult = [];

    blizzardIds.forEach(({ blizzardId }) => {
        formatedResult.push(blizzardId);
    });

    return formatedResult;
};
