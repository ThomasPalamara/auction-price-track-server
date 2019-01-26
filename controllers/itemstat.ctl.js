const { isISO8601 } = require('validator');
const itemStatService = require('../services/itemstat.srv');
const { yesterdayDate } = require('../helpers/dateUtils');

exports.getItemStats = async ({ params, query }, res) => {
    const start = query.start || yesterdayDate().toISOString();
    const end = query.end || new Date().toISOString();


    if (!isISO8601(start, { strict: true }) || !isISO8601(end, { strict: true })) {
        res.status(400).send({ message: 'start and end parameters must be in ISO 8601 format' });

        return;
    }

    if (start > end) {
        res.status(400).send({ message: 'end must be higher than start' });

        return;
    }

    const itemStats = await itemStatService
        .findByRealmAndItemId(params.realm, params.itemId, start, end);

    res.json(itemStats);
};
