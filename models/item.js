const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    name: String,
    name_fr: String,
    blizzardId: { type : Number , unique : true, required : true },
});

const Item = mongoose.model('item', itemSchema);

module.exports = Item;
