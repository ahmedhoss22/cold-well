const express = require("express");
const app = express();
const compression = require('compression');
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

const routes = require("../routes");
let logger = require("morgan");

const cookieParser = require("cookie-parser");
const path =require("path");

const {
  corsOptions,
  mongoSanitizeOptions,} = require("./options");
global.__basedir = path.resolve(__dirname, '..');

app.use(require("../utils/response/responseHandler"));

app.use(cors(corsOptions));
app.use(compression());
app.use(logger("dev"));

app.use(cookieParser());
app.use(express.json({ limit: "50kb" }));
app.use(mongoSanitize(mongoSanitizeOptions));
app.use(express.urlencoded({ extended: false, limit: "30mb" }));
app.use("/cold-well/v1", routes);
app.use('/uploads', express.static(path.join(__basedir, 'uploads')));

app.use("*", (req, res) => {
  return res.recordNotFound({message:`Cant't find route method:${req.method} url:${req.originalUrl}`});
});

module.exports = app;
