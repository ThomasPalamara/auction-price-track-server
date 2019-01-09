const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auctionInformation = new Schema({
    lastSaved: { type : Date, required : true },
    realm: { type : String , unique : true, required : true },
});

const AuctionInformation = mongoose.model('auctioninfo', auctionInformation);

module.exports = AuctionInformation;
