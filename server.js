const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const routerRealms = require('./router/router_realms');
const routerAuctions = require('./router/router_auctions');
const routerDB = require('./router/router_initdb');
const routerItem = require('./router/router_items');
const connexion = require('./connexion');
const config = require('./config');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.use(morgan(config.morganFormat));

app.use('/api', [routerRealms, routerAuctions, routerItem, routerDB]);

app.listen(port, () => console.log(`Listening on port ${port}`));