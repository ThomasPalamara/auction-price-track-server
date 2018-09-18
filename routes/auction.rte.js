const router = require('express').Router();
const wrapAsync = require('../utils/wrapasync');
const auctionController = require('../controllers/auction.ctl');

router.get('/:realm', wrapAsync(auctionController.getAuctions));

module.exports = router;