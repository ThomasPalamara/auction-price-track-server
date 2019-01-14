const router = require('express').Router();
const wrapAsync = require('../helpers/wrapasync');
const realmController = require('../controllers/realm.ctl');

router.get('/', wrapAsync(realmController.getRealms));

module.exports = router;
