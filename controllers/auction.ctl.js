const auctionService = require('../services/auction.srv');
const winston = require('../config/winston');

exports.getAuctions = async (req, res) => {
    let realm = req.params.realm;

    try{
        const auctions = await auctionService.findAuctionsByRealm(realm);

        res.json(auctions);
    }
    catch (error) {
        winston.error('Error unknown : ' + error);

        res.statusCode = 500;
        res.send({message : 'Something bad happened'});
    }
};