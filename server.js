'use strict';

var express = require('express'),
    fs = require('fs'),
    passport = require('passport'),
    logger = require('mean-logger');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./app/config'),
    mongoose = require('./app/mongoose');

var db = mongoose.connect(config.db);

var models_path = __dirname + '/app/models';
var walkModels = function (path) {
    fs.readdirSync(path).forEach(function (file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {
            walkModels(newPath);
        }
    });
};
walkModels(models_path);

require('./app/passport')(passport);

var app = express();
require('./app/express')(app, passport, db);

var routes_path = __dirname + '/app/routes';
var walkRoutes = function (path) {
    fs.readdirSync(path).forEach(function (file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath)(app, passport);
            }
            // We skip the app/routes/middlewares directory as it is meant to be
            // used and shared by routes as further middlewares and is not a
            // route by itself
        } else if (stat.isDirectory() && file !== 'middlewares') {
            walkRoutes(newPath);
        }
    });
};
walkRoutes(routes_path);

var port = process.env.PORT || config.port;
app.listen(port);
console.log('Compass started on port ' + port);

logger.init(app, passport, mongoose);

module.exports = app;
