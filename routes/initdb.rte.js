const router = require('express').Router();
const wrapAsync = require('../utils/wrapasync');
const initDbController = require('../controllers/initdb.ctl');

router.post('/realms', wrapAsync(initDbController.initRealms));

router.post('/recipes', wrapAsync(initDbController.initRecipes));

module.exports = router;
