require("dotenv").config();
const express = require("express");
const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");

const winston = require("./config/winston");

const swaggerDocument = YAML.load("./swagger.yaml");

const initDbConnexion = require("./db/dbConnection");
const initRoutes = require("./routes");

const app = express();

initDbConnexion();
initRoutes(app);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.PORT || 5000;

app.listen(port, () => winston.info(`Listening on port ${port}...`));
