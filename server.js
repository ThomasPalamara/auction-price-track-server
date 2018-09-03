const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const routerRealms = require('./routes/realm.routes');
const routerAuctions = require('./routes/auction.routes');
const routerDB = require('./routes/initdb.routes');
const routerItem = require('./routes/item.routes');
const connexion = require('./connexion');
const config = require('./config');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.use(morgan(config.morganFormat));

app.use('/api', [routerRealms, routerAuctions, routerItem, routerDB]);

app.listen(port, () => console.log(`Listening on port ${port}`));