const Realm = require("../models/realm");
const rp = require('request-promise');
const constants = require('../config/constants');
const winston = require('../config/winston');

exports.findAll = () => {
    return Realm.find();
};

exports.processRealms = async () => {

    const realms = (await fetchRealms()).realms;

    for (let index = 0; index < realms.length; index++) {
        let realm = realms[index];

        processRealm(realm);
    }
};

const fetchRealms = () => {
    return rp(`${constants.blizzardURL}/realm/status?locale=en_GB&apikey=${constants.apiKey}`, {json: true})
};

const processRealm = async (realm) => {
    try {
        if (realm.locale === "fr_FR") {
            const savedRealm = await saveRealm(realm);
            winston.info(`Found and saved: ${JSON.stringify(savedRealm)}`);
        }
    }
    catch (error) {
        winston.error('Error unknown for realm ' + realm.slug + ' : ' + error);
    }
};

const saveRealm = (realm) => {
    const realmModel = new Realm({
        value: realm.slug,
        label: realm.name,
    });

    return realmModel.save();
};