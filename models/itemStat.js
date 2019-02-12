const mongoose = require('mongoose');

const { Schema } = mongoose;

const itemStatSchema = new Schema({
    itemId: { type: Number, required: true },
    itemCount: { type: Number, required: true },
    mean: { type: Number },
    median: { type: Number },
    mode: { type: Number },
    min: { type: Number },
    max: { type: Number },
    percentile5: { type: Number },
    percentile25: { type: Number },
    percentile75: { type: Number },
    percentile95: { type: Number },
    timestamp: { type: Date, required: true },
    realm: { type: String, required: true },
});

const ItemStat = mongoose.model('itemstat', itemStatSchema);

module.exports = ItemStat;
