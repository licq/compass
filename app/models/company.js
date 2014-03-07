'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    validator = require('validator'),
    _ = require('lodash');

var companySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});



module.exports = mongoose.model('Company', companySchema);