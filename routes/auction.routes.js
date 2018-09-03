const router = require('express').Router();
const auctionController = require('../controllers/auction.ctl');

router.get('/auctions/:realm', auctionController.getAuctions);

module.exports = router;