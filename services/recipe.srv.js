const Recipe = require('../models/recipe');
const winston = require('../config/winston');
const recipes = require('../config/recipes');
const wait = require('../helpers/wait');
const itemService = require('../services/item.srv');

exports.findAll = () => Recipe.find();

exports.initRecipeCollection = async (cleanItemCollection) => {
    await cleanRecipeCollection();

    if (cleanItemCollection) {
        await itemService.cleanItemCollection();
    }

    for (let i = 0; i < recipes.length; i++) {
        // The initialization of recipes is slowed down so it doesn't break Blizzard API Limits
        if (i % 15 === 0) {
            // eslint-disable-next-line no-await-in-loop
            await wait(1000);
        }

        /*
        * We wait for the previous recipe to finish so async initialization of items doesn't
        * cause items to be added multiple times
        */
        // eslint-disable-next-line no-await-in-loop
        await processRecipe(recipes[i]);
    }
};

const cleanRecipeCollection = async () => {
    await Recipe.remove({});
};

const processRecipe = async (recipe) => {
    try {
        const populatedRecipe = await populateItems(recipe);

        const savedRecipe = await saveRecipe(populatedRecipe);

        winston.debug(`Saved recipe ${savedRecipe._id}`);

        return savedRecipe;
    } catch (error) {
        logRecipeError(error, recipe);

        throw new Error('Initialization of recipes collection failed');
    }
};

const populateItems = async (recipe) => {
    const populatedRecipe = { ...recipe };

    if (!recipe.isCustom) {
        populatedRecipe.craft = await populateItem(recipe.craft);
    }

    populatedRecipe.reagents = await populateReagents(recipe.reagents);

    return populatedRecipe;
};

const populateItem = async (item) => {
    let savedItem = await itemService.findByBlizzardId(item.blizzardId);

    // Save Item in the item collection if it doesn't exist
    if (!savedItem) {
        savedItem = await itemService.storeItem(item.blizzardId);
    }

    const populatedItem = {
        blizzardId: item.blizzardId,
        quantity: item.quantity,
        name: savedItem.name,
        name_fr: savedItem.name_fr,
    };

    return populatedItem;
};

const populateReagents = async (reagents) => {
    const promises = [];

    reagents.forEach((reagent) => {
        promises.push(populateItem(reagent));
    });

    return Promise.all(promises);
};

const saveRecipe = (recipe) => {
    const recipeModel = new Recipe(recipe);

    return recipeModel.save();
};

const logRecipeError = (error, recipe) => {
    // Error object is not displayed beautifully when using string templates
    // eslint-disable-next-line prefer-template
    winston.error('Error unknown for recipe ' + JSON.stringify(recipe) + ' : ' + error);
};
