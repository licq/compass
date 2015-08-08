'use strict';

var request = require('request'),
    config = require('../config/config');

exports.parse = function (data, callback) {

    var req = request.post({
        uri: config.resumeParser.host,
    }, function (err, res, body) {
        var resume = JSON.parse(body);
        callback(err, res, resume);
    });

    if (!data instanceof Buffer){
        data = new Buffer(data);
    }
    var form = req.form();
    form.append('resumeFile', data, {filename: 'resumeToParse'});
};