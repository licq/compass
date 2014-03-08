'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var companySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});


module.exports = mongoose.model('Company', companySchema);