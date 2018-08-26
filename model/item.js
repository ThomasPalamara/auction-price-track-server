const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name: String,
    name_fr: String,
    id: { type : Number , unique : true, required : true },
});

const Item = mongoose.model('item', ItemSchema);

module.exports = Item;