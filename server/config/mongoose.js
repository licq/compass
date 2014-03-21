'use strict';

var mongoose = require('mongoose');

module.exports = function (config) {
    mongoose.connect(config.db);
    var db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error...'));

    db.once('open', function () {
        console.log('compass db connected');
    });

    require('../models/user');
    require('../models/article');
    require('../models/company');
    require('../models/email');
    require('../models/mail');
    require('../models/signup');
    require('../models/token');

};