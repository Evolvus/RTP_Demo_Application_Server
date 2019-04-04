const logName = "api:auth:";
const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const config = require("config");
const mongoose = require('mongoose');
var connection = mongoose.connect('mongodb://localhost:27017/RTP_Demo_Application', { useNewUrlParser: true });

var IP = "127.0.0.1";
var PORT = "5359";

var app = express();
var router = express.Router();



app.use(bodyParser.urlencoded({
  limit: '1mb',
  extended: true
}));

app.use(bodyParser.json({
  limit: '1mb'
}));

app.use(cors());

require("./routes/main")(router);

app.use("/api", router);

app.listen(PORT, IP, () => {
  //log.debug(`${logName} Http Server Started on IP ${IP} - PORT ` + PORT);
  console.log("application started", PORT, IP);
});

module.exports.app = app;

