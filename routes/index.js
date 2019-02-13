const morgan = require('morgan');
const cors = require('cors');
const boolParser = require('express-query-boolean');
const { morganFormat } = require('../config/constants');

const realmsRouter = require('./realm.rte');
const auctionsRouter = require('./auction.rte');
const itemStatsRouter = require('./itemstat.rte');
const itemRouter = require('./item.rte');
const recipeRouter = require('./recipe.rte');

const errorMiddleware = require('../middlewares/error.mw');


module.exports = function initRoutes(app) {
    app.use(cors());
    app.use(boolParser());
    app.use(morgan(morganFormat));

    app.get('/', (req, res) => res.redirect('/api'));

    app.get('/api', (req, res) => res.send('Welcome to the Auction Price Tracker API. To find the API documentation, go to /api/docs'));

    app.use('/api/realms', realmsRouter);
    app.use('/api/items', itemRouter);
    app.use('/api/recipes', recipeRouter);
    app.use('/api/auctions', auctionsRouter);
    app.use('/api/itemstats', itemStatsRouter);
    app.use('/', errorMiddleware);
};
