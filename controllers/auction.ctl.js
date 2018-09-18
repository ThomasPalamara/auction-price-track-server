const auctionService = require('../services/auction.srv');

exports.getAuctions = async (req, res) => {
    let realm = req.params.realm;
    const auctions = await auctionService.findAuctionsByRealm(realm);

    res.json(auctions);
};