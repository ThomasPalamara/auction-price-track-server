const router = require('express').Router();
const initDbController = require('../controllers/initdb.ctl');

router.get('/items', initDbController.storeItems);

router.get('/realms', initDbController.storeRealms);

module.exports = router;
