const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auctionSchema = new Schema({
    unitPrice: { type : Number, required : true },
    quantity: { type : Number, required : true },
});

const auctionDataSchema = new Schema({
    itemId: { type : Number, required : true },
    timestamp: { type : Date, required : true },
    realm: { type: String, required: true },
    auctions: {
        type: [ auctionSchema ],
        validate: {
            validator: function(value) {
                    return value && value.length > 0;
            },
            message: 'an auctionData should atleast have one auction',
        }
    },
});

// TODO trouver un meilleur nom que AuctionData
const AuctionData = mongoose.model('auction', auctionDataSchema);

module.exports = AuctionData;
