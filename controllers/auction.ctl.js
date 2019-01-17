const { isISO8601 } = require('validator');
const auctionService = require('../services/auction.srv');
const { yesterdayDate } = require('../helpers/dateUtils');

exports.refreshAuctions = async (req, res) => {
    await auctionService.refreshAuctionsData();

    res.json({message: "Auctions up to date"});
};

exports.getAuctions = async (req, res) => {
    const start = req.query.start || yesterdayDate().toISOString();
    const end = req.query.end || new Date().toISOString();

    if ( !isISO8601(start, { strict: true }) || !isISO8601(end, { strict: true }) ) return res.status(400).send({message: "start and end parameters must be in ISO 8601 format"})

    if ( start > end ) return res.status(400).send({message: "end must be higher than start"})

    const auctions = await auctionService.findByRealmAndItemId(req.params.realm, req.params.itemId, start, end);

    res.json(auctions);
};
