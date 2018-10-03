const router = require('express').Router();
const wrapAsync = require('../utils/wrapasync');
const recipeController = require('../controllers/recipe.ctl');

router.get('/', wrapAsync(recipeController.getRecipes));

router.get('/test', wrapAsync(recipeController.test));

module.exports = router;