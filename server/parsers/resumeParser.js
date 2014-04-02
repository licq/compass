var _ = require('lodash'),
    logger = require('../config/winston').logger();

var parsers = [require('./job51Parser'), require('./zhaopinParser')];
exports.parse = function (data) {
    var parser = _.find(parsers, function (parser) {
        return parser.test(data);
    });
    if (parser) return parser.parse(data);
};
