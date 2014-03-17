'use strict';

var mongoose = require('mongoose'),
    uuid = require('node-uuid');

var tokenSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'},
    _id: {
        type: String,
        default: uuid.v1(),
        unique: true
    }
});

mongoose.model('Token', tokenSchema);

