const auctionService = require('../services/auction.srv');
const { yesterdayTimestamp } = require('../helpers/dateUtils');

exports.refreshAuctions = async (req, res) => {
    await auctionService.refreshAuctionsData();

    res.json({message: "Auctions up to date"});
};

exports.getAuctions = async (req, res) => {
    const start = req.query.start ? Number(req.query.start) : yesterdayTimestamp();
    const end = req.query.end ? Number(req.query.end) : Date.now();

    if ( isNaN(start) || isNaN(end) ) return res.status(400).send({message: "start and end parameters must be numbers"})

    if ( start > end ) return res.status(400).send({message: "end must be higher than start"})

    const auctions = await auctionService.findByRealmAndItemId(req.params.realm, req.params.itemId, start, end);

    res.json(auctions);
};
