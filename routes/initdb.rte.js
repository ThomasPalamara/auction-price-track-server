const router = require('express').Router();
const wrapAsync = require('../helpers/wrapasync');
const initDbController = require('../controllers/initdb.ctl');

router.post('/realms', wrapAsync(initDbController.initRealms));

router.post('/recipes', wrapAsync(initDbController.initRecipes));

module.exports = router;
