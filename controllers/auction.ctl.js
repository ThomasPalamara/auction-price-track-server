const auctionService = require('../services/auction.srv');

exports.refreshAuctions = async (req, res) => {
    await auctionService.refreshAuctionsData();

    res.json({ message: 'Auctions up to date' });
};
