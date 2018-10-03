const Realm = require("../models/realm");
const rp = require('request-promise');
const constants = require('../config/constants');
const winston = require('../config/winston');

exports.findAll = () => {
    return Realm.find();
};

exports.initRealmCollection = async () => {
    const realms = (await fetchRealms()).realms;

    await removeRealmCollection();

    const realmPromises = [];

    for (let index = 0; index < realms.length; index++) {
        realmPromises.push(processRealm(realms[index]));
    }

    return Promise.all(realmPromises);
};

const removeRealmCollection = () => {
    return Realm.collection.drop();
};

const fetchRealms = () => {
    return rp(`${constants.blizzardURL}/realm/status?locale=en_GB&apikey=${constants.apiKey}`, {json: true})
};

const processRealm = async (realm) => {
    try {
        if (realm.locale === "fr_FR") {
            let savedRealm = await saveRealm(realm);
            winston.info(`Saved realm ${savedRealm.name}`);

            return savedRealm;
        }
    }
    catch (error) {
        winston.error('Error unknown for realm ' + realm.name + ' : ' + error);

        throw new Error('Initialization of realm collection failed');
    }
};

const saveRealm = (realm) => {
    const realmModel = new Realm({
        slug: realm.slug,
        name: realm.name,
    });

    return realmModel.save();
};