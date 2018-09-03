const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//TODO modifier nom des attributs
const RealmSchema = new Schema({
    value: { type : String , unique : true, required : true },
    label: { type : String , unique : true, required : true },
});

const Realm = mongoose.model('realm', RealmSchema);

module.exports = Realm;