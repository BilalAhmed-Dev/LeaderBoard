let express = require('express');
let bodyParser = require('body-parser');
let schedule = require('node-schedule');
const async = require('async')
const dotenv = require('dotenv').config();
const cors = require('cors');
let app = express();
app.use(cors());
exports.app = app;
var port = process.env.PORT || 8080;

//Importing models
let redis = require('./models/redis');
const Mongo = require('./models/mongodb');

const redisDb = new redis();
exports.redisDb = redisDb;
let mongoDb = new Mongo();
exports.mongoDb = mongoDb;

app.use(bodyParser.urlencoded({ extended: false }));

//Setup listening port
app.listen(port, function () {
    console.log("Application running on port " + port);
});

//Import Routes
require('./routes/authRoutes');
require('./routes/scoreRoutes');
