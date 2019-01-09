const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constants = require('../config/constants');

const itemSchema = new Schema({
    name: { type: String, required: true },
    name_fr: { type: String, required: true },
    blizzardId: { type: Number, required: true },
    quantity: { type: Number, required: true },
});

const recipeSchema = new Schema({
    isCustom: { type: Boolean, default: false },
    type: {
        type: String,
        enum: constants.recipeTypes,
        lowercase: true,
    },
    professions: {
        type: [{
            type: String,
            enum: constants.wowProfessions,
            lowercase: true,
        }],
        validate: {
            validator: function(value) {
                    return value && value.length > 0;
            },
            message: 'A recipe should have atleast one profession',
        }
    },
    craft: itemSchema,
    reagents: {
        type: [ itemSchema ],
        validate: {
            validator: function(value) {
                    return value && value.length > 0;
            },
            message: 'A recipe should have atleast one reagent',
        }
    },
});

const Recipe = mongoose.model('recipe', recipeSchema);

module.exports = Recipe;
