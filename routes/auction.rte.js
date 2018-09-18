const router = require('express').Router();
const auctionController = require('../controllers/auction.ctl');

router.get('/:realm', auctionController.getAuctions);

module.exports = router;