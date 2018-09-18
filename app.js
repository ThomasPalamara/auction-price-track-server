const express = require('express');
const winston = require('./config/winston');

const initDbConnexion = require('./config/db');
const initRoutes = require('./routes');

const app = express();
initDbConnexion();
initRoutes(app);

const port = process.env.PORT || 5000;

app.listen(port, () => winston.info(`Listening on port ${port}...`));