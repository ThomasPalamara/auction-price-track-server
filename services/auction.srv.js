const AuctionData = require("../models/auctionData");
const AuctionInformation = require("../models/auctionInformation");
const blizzardAPI = require('../helpers/blizzardAPI');
const itemService = require('./item.srv');
const itemStatService = require('./itemstat.srv');
const realmService = require('./realm.srv');
const winston = require('../config/winston');

exports.findByRealmAndItemId = (realm, itemId, start, end) => {
    return AuctionData.find({
        'realm' : realm,
        'itemId' : itemId,
        'timestamp' : {
           '$gte': start,
           '$lte': end
        }
    });
};

exports.refreshAuctionsData = async () => {
    const realms = await realmService.findAll();

    for (realm of realms ) {
        winston.info(`updating realm ${realm.slug}...`);
        await fetchAndSaveAuctionsData(realm.slug);
        winston.info(`realm ${realm.slug} finished`);
    }

    winston.info('All auctions are up to date');
};

const fetchAndSaveAuctionsData = async (realm) => {
    const { lastSaved } = await getLastSavedDate(realm);

    const { url, lastModified } = (await blizzardAPI.fetchRealmAuctionsUrl(realm)).files[0];

    if( lastSaved.getTime() === lastModified ) {
        winston.info(`Auctions for realm ${realm} are already up to date`);

        return;
    }

    const auctions = (await blizzardAPI.fetchAuctions(url)).auctions;

    const aggregatedAuctions = await aggregateByItem(auctions, realm, lastModified);

    await computeAndSaveStats(aggregatedAuctions, realm, lastModified);

    return updateLastSavedDate(lastModified, realm);
};

const getLastSavedDate = (realm) => {
    return AuctionInformation.findOne({ 'realm' : realm });
};

const updateLastSavedDate = async (date, realm) => {
    let auctionInformation = await getLastSavedDate(realm);

    if( auctionInformation ) {
        auctionInformation.lastSaved = date;
    }
    else {
        auctionInformation = new AuctionInformation({
            realm: realm,
            lastSaved: date,
        });
    }

    return auctionInformation.save();
};

const aggregateByItem = async (auctions, realm, timestamp) => {
    const aggregatedAuctions = {};

    const blizzardIds = await itemService.findAllBlizzardIds();
    const itemIds = formatIds(blizzardIds);

    auctions.forEach( auction => {
        if (auction.buyout > 0 && itemIds.includes(auction.item)) {
            const unitPrice = Math.round(auction.buyout / auction.quantity);

            if( !aggregatedAuctions[auction.item] ) {
                aggregatedAuctions[auction.item] = [];
            }

            const auctionData = aggregatedAuctions[auction.item].find( (auctionData) => auctionData.unitPrice === unitPrice)
            if( !auctionData ) {
                aggregatedAuctions[auction.item].push({
                    unitPrice: unitPrice,
                    quantity: auction.quantity,
                });
            }
            else {
                auctionData.quantity += auction.quantity;
            }
        }
    });

    // At the moment, auctions are stored but we don't know yet if it will be used
    saveAuctions(aggregatedAuctions, realm, timestamp);

    return aggregatedAuctions;
};

const computeAndSaveStats = async (aggregatedAuctions, realm, timestamp) => {

    for (itemId in aggregatedAuctions) {
        let auctionsData = aggregatedAuctions[itemId];

        let itemStat = itemStatService.computeStats(auctionsData);

        await itemStatService.saveItemStat(itemId, itemStat, realm, timestamp);
    }
};

const saveAuctions = (aggregatedAuctions, realm, timestamp) => {

    for (itemId in aggregatedAuctions) {
        saveAuction(itemId, aggregatedAuctions[itemId], realm, timestamp);
    }
};

const saveAuction = (itemId, auctionData, realm, timestamp) => {
    const auctionDataModel = new AuctionData({
        itemId: itemId,
        auctions: auctionData,
        timestamp: timestamp,
        realm: realm,
    });

    auctionDataModel.save();
};

const formatIds = blizzardIds => {
    const formatedResult = []

    for (let value of blizzardIds) {
        formatedResult.push(value.blizzardId);
    };

    return formatedResult;
};
