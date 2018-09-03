const express = require('express');
<<<<<<< HEAD
const morgan = require('morgan');
const cors = require('cors');
const routerRealms = require('./router/router_realms');
const routerAuctions = require('./router/router_auctions');
const routerDB = require('./router/router_initdb');
const routerItem = require('./router/router_items');
=======
const morgan = require('morgan')
const routerRealms = require('./routes/realm.routes');
const routerAuctions = require('./routes/auction.routes');
const routerDB = require('./routes/initdb.routes');
const itemRoutes = require('./routes/item.routes');
>>>>>>> b9f9ae9fe6285550f31597da6b7ac5e447e7d417
const connexion = require('./connexion');
const config = require('./config');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.use(morgan(config.morganFormat));

app.use('/api', [routerRealms, routerAuctions, itemRoutes, routerDB]);

app.listen(port, () => console.log(`Listening on port ${port}`));