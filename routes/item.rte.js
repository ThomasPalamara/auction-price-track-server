const router = require('express').Router();
const itemController = require('../controllers/item.ctl');

router.get('/', itemController.getItems);

module.exports = router;