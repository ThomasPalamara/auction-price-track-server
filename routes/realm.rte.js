const router = require('express').Router();
const realmController = require('../controllers/realm.ctl');

router.get('/', realmController.getRealms);

module.exports = router;