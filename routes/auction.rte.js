const router = require("express").Router();
const wrapAsync = require("../helpers/wrapasync");
const auctionController = require("../controllers/auction.ctl");

// TODO delete
router.post("/", wrapAsync(auctionController.refreshAuctions));

module.exports = router;
