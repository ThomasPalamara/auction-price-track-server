const router = require('express').Router();
const wrapAsync = require('../helpers/wrapasync');
const itemStatController = require('../controllers/itemstat.ctl');

router.get('/:realm/:itemId', wrapAsync(itemStatController.getItemStatsFilteredByTime));

module.exports = router;
