const Realm = require("../models/realm");
const blizzardAPI = require('../helpers/blizzardAPI');
const winston = require('../config/winston');

exports.findAll = () => {
    return Realm.find();
};

exports.initRealmCollection = async () => {
    const realms = (await blizzardAPI.fetchRealms()).realms;

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

const processRealm = async (realm) => {
    try {
        if (realm.locale === "fr_FR") {
            let savedRealm = await saveRealm(realm);
            winston.debug(`Saved realm ${savedRealm.name}`);

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
