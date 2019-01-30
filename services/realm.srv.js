const Realm = require('../models/realm');
const blizzardAPI = require('../helpers/blizzardAPI');
const winston = require('../config/winston');

exports.findAll = () => Realm.find();

exports.initRealmCollection = async () => {
    const { realms } = (await blizzardAPI.fetchRealms());

    await removeRealmCollection();

    const realmPromises = [];

    realms.forEach((realm) => {
        realmPromises.push(processRealm(realm));
    });

    return Promise.all(realmPromises);
};

const removeRealmCollection = () => Realm.collection.drop();

const processRealm = async (realm) => {
    try {
        if (realm.locale === 'fr_FR') {
            const savedRealm = await saveRealm(realm);
            winston.debug(`Saved realm ${savedRealm.name}`);

            return savedRealm;
        }

        return null;
    } catch (error) {
        // Error object is not displayed beautifully when using string templates
        // eslint-disable-next-line prefer-template
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
