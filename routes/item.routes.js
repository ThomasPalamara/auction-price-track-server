const router = require('express').Router();
const itemController = require('../controllers/item.ctl');

router.get('/items', itemController.getItems);

module.exports = router;