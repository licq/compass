'use strict';

var mongoose = require('mongoose'),
  uuid = require('node-uuid');

var tokenSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'},
  _id: {
    type: String,
    unique: true
  }
});

tokenSchema.pre('save', function (next) {
  if (!this.isNew) return next();
  this._id = uuid.v1();
  next();
});

mongoose.model('Token', tokenSchema);

