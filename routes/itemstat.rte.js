const router = require('express').Router();
const wrapAsync = require('../utils/wrapasync');
const itemStatController = require('../controllers/itemstat.ctl');

router.get('/:realm/:itemId', wrapAsync(itemStatController.getItemStats));

module.exports = router;
