const router = require('express').Router();
const wrapAsync = require('../utils/wrapasync');
const itemController = require('../controllers/item.ctl');

router.get('/', wrapAsync(itemController.getItems));

module.exports = router;