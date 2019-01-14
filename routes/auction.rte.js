const router = require('express').Router();
const wrapAsync = require('../helpers/wrapasync');
const auctionController = require('../controllers/auction.ctl');

router.post('/', wrapAsync(auctionController.refreshAuctions));

router.get('/:realm/:itemId', wrapAsync(auctionController.getAuctions));

module.exports = router;
