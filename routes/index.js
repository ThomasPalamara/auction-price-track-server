const morgan = require('morgan');
const cors = require('cors');
const constants = require('../config/constants');

const realmsRouter = require('./realm.rte');
const auctionsRouter = require('./auction.rte');
const initDbRouter = require('./initdb.rte');
const itemRouter = require('./item.rte');
const recipeRouter = require('./recipe.rte');

const errorMiddleware = require('../middlewares/error.mw');
var boolParser = require('express-query-boolean');

module.exports = function initRoutes(app) {
    app.use(cors());
    app.use(boolParser());
    app.use(morgan(constants.morganFormat));

    app.use('/api/realms', realmsRouter);
    app.use('/api/items', itemRouter);
    app.use('/api/recipes', recipeRouter);
    app.use('/api/auctions', auctionsRouter);
    app.use('/api/initdb', initDbRouter);
    app.use('/', errorMiddleware);
};