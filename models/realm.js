const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const realmSchema = new Schema({
    slug: { type : String , unique : true, required : true },
    name: { type : String , unique : true, required : true },
});

const Realm = mongoose.model('realm', realmSchema);

module.exports = Realm;