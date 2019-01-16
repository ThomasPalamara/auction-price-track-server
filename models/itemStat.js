const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemStatSchema = new Schema({
    itemId: { type : Number , required : true },
    itemCount: { type : Number , required : true },
    mean: { type : Number , required : true },
    median: { type : Number , required : true },
    mode: { type : Number , required : true },
    min: { type : Number , required : true },
    max: { type : Number , required : true },
    percentile5: { type : Number , required : true },
    percentile25: { type : Number , required : true },
    percentile75: { type : Number , required : true },
    percentile95: { type : Number , required : true },
    timestamp: { type : Date , required : true },
    realm: { type: String, required: true },
});

const ItemStat = mongoose.model('itemstat', itemStatSchema);

module.exports = ItemStat;
