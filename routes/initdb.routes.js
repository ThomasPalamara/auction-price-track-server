const router = require('express').Router();
const initDbController = require('../controllers/initdb.ctl');

router.get('/initdb/items', initDbController.storeItems);

router.get('/initdb/realms', initDbController.storeRealms);

module.exports = router;
