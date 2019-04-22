const moment = require('moment');
const itemStatService = require('../services/itemstat.srv');

exports.getItemStatsFilteredByTime = async ({ params, query }, res) => {
    const startTime = query.start ? moment(query.start, moment.ISO_8601) : moment.utc()
        .subtract(28, 'days')
        .startOf('day');
    const endTime = query.end ? moment(query.end, moment.ISO_8601) : moment();

    if (!startTime.isValid() || !endTime.isValid()) {
        res.status(400).send({
            message: 'start and end parameters must be valid dates in ISO 8601 format',
        });

        return;
    }

    if ((startTime).isAfter(endTime)) {
        res.status(400).send({ message: 'end must be higher than start' });

        return;
    }

    const itemStats = await itemStatService
        .findByRealmAndItemIdFilteredByTime(
            params.realm,
            params.itemId,
            startTime.toDate(),
            endTime.toDate(),
        );

    res.json(itemStats);
};
