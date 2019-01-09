const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemStatSchema = new Schema({
    itemId: { type : Number , required : true },
    averagePrice: { type : Number , required : true },
    minPrice: { type : Number , required : true },
    maxPrice: { type : Number , required : true },
    timestamp: { type : Date , required : true },
    realm: { type: String, required: true },
});

const ItemStat = mongoose.model('itemstat', itemStatSchema);

module.exports = ItemStat;
