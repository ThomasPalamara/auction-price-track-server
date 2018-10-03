const itemService = require('../services/item.srv');
const realmService = require('../services/realm.srv');
const recipeService = require('../services/recipe.srv');

exports.initRealms =  async (req, res) => {
    await realmService.initRealmCollection();

    res.send({message: "Initialization of realms finished successfully"});
};

exports.initRecipes =  async (req, res) => {
    await recipeService.initRecipeCollection(req.query.cleanitemcollection);

    res.send({message: "Initialization of recipes finished successfully"});
};
