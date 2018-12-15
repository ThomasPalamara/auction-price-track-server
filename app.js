const express = require('express');
const winston = require('./config/winston');

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const initDbConnexion = require('./config/db');
const initRoutes = require('./routes');

const app = express();

initDbConnexion();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
initRoutes(app);

const port = process.env.PORT || 5000;

app.listen(port, () => winston.info(`Listening on port ${port}...`));
