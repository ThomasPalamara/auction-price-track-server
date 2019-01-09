const itemStatService = require('../services/itemstat.srv');
const { yesterdayTimestamp } = require('../utils/dateUtils');

exports.getItemStats = async (req, res) => {
    const start = req.query.start ? Number(req.query.start) : yesterdayTimestamp();
    const end = req.query.end ? Number(req.query.end) : Date.now();

    if ( isNaN(start) || isNaN(end) ) return res.status(400).send({message: "start and end parameters must be numbers"})

    if ( start > end ) return res.status(400).send({message: "end must be higher than start"})

    const itemStats = await itemStatService.findByRealmAndItemId(req.params.realm, req.params.itemId, start, end);

    res.json(itemStats);
};
