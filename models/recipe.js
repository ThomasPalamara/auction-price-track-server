const mongoose = require("mongoose");
const { recipeTypes, wowProfessions } = require("../config/constants");

const { Schema } = mongoose;

const itemSchema = new Schema({
  name: { type: String, required: true },
  name_fr: { type: String, required: true },
  blizzardId: { type: Number, required: true },
  quantity: { type: Number, required: true }
});

const recipeSchema = new Schema({
  isCustom: { type: Boolean, default: false },
  type: {
    type: String,
    enum: recipeTypes,
    lowercase: true
  },
  professions: {
    type: [
      {
        type: String,
        enum: wowProfessions,
        lowercase: true
      }
    ],
    validate: {
      validator: value => value && value.length > 0,
      message: "A recipe should have atleast one profession"
    }
  },
  craft: itemSchema,
  reagents: {
    type: [itemSchema],
    validate: {
      validator: value => value && value.length > 0,
      message: "A recipe should have atleast one reagent"
    }
  }
});

const Recipe = mongoose.model("recipe", recipeSchema);

module.exports = Recipe;
