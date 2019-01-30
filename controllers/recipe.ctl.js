const recipeService = require('../services/recipe.srv');

exports.getRecipes = async (req, res) => {
    const recipes = await recipeService.findAll();

    res.json(recipes);
};
