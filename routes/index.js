const morgan = require('morgan');
const cors = require('cors');
const constants = require('../config/constants');

const realmsRouter = require('./realm.rte');
const auctionsRouter = require('./auction.rte');
const initDbRouter = require('./initdb.rte');
const itemRouter = require('./item.rte');

const errorMiddleware = require('../middlewares/error.mw');

module.exports = function initRoutes(app) {
    app.use(cors());
    app.use(morgan(constants.morganFormat));

    app.use('/api/realms', realmsRouter);
    app.use('/api/items', itemRouter);
    app.use('/api/auctions', auctionsRouter);
    app.use('/api/initdb', initDbRouter);
    app.use('/', errorMiddleware);
};