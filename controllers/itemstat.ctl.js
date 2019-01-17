const { isISO8601 } = require('validator');
const itemStatService = require('../services/itemstat.srv');
const { yesterdayDate } = require('../helpers/dateUtils');

exports.getItemStats = async (req, res) => {
    const start = req.query.start || yesterdayDate().toISOString();
    const end = req.query.end || new Date().toISOString();

    if ( !isISO8601(start, { strict: true }) || !isISO8601(end, { strict: true }) ) return res.status(400).send({message: "start and end parameters must be in ISO 8601 format"})

    if ( start > end ) return res.status(400).send({message: "end must be higher than start"})

    const itemStats = await itemStatService.findByRealmAndItemId(req.params.realm, req.params.itemId, start, end);

    res.json(itemStats);
};
