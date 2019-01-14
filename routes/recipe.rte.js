const router = require('express').Router();
const wrapAsync = require('../helpers/wrapasync');
const recipeController = require('../controllers/recipe.ctl');

router.get('/', wrapAsync(recipeController.getRecipes));

module.exports = router;
