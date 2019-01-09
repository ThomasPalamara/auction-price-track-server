const express = require('express');
const winston = require('./config/winston');

const initDbConnexion = require('./config/db');
const initRoutes = require('./routes');
const setupCronJobs = require('./cronjobs');

const app = express();
initDbConnexion();
setupCronJobs();
initRoutes(app);

const port = process.env.PORT || 5000;

app.listen(port, () => winston.info(`Listening on port ${port}...`));
