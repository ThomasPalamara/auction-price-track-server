require('dotenv').config();
const realmService = require('../services/realm.srv');
const recipeService = require('../services/recipe.srv');
const initDbConnexion = require('./dbConnection');
const winston = require('../config/winston');

(async () => {
    try {
        const cleanItemCollection = process.argv[2] === 'cleanItemCollection=true';

        await initDbConnexion();

        winston.info('Initializing realm MongoDB collection...');

        await realmService.initRealmCollection();

        winston.info('Initialization of realm collection successfully finished');

        winston.info('Initializing recipe and item MongoDB collections...');

        await recipeService.initRecipeCollection(cleanItemCollection);

        winston.info('Initialization of recipe and item collections successfully finished');

        process.exit(0);
    } catch (error) {
        winston.error('Error initializing db collections', error);

        process.exit(1);
    }
})();
