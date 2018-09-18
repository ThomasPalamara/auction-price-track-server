const router = require('express').Router();
const wrapAsync = require('../utils/wrapasync');
const initDbController = require('../controllers/initdb.ctl');

router.get('/items', wrapAsync(initDbController.storeItems));

router.get('/realms', wrapAsync(initDbController.storeRealms));

module.exports = router;
