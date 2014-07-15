'use strict';

var mongoose = require('mongoose'),
  timestamps = require('mongoose-timestamp'),
  validator = require('validator'),
  merge = require('mongoose-merge-plugin'),
  User = mongoose.model('User'),
  async = require('async'),
  _ = require('lodash');
var positionSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, '职位名不能为空']
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  department: String,
  evaluationCriterions: [
    {name: String, rate: Number}
  ],
  owners: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  }
});

function arrayToString(array) {
  return  _.map(array, function (element) {
    return element.toString();
  });
}

function updateUsers(owners, position, operation, cb) {
  User.find({_id: {$in: owners}}, function (err, users) {
    if (err) return cb(err);
    async.each(users, function (user, callback) {
      var positions = arrayToString(user.positions || []);

      if (operation === 'add') {
        positions = _.union(positions, [position.id]);
      } else if (operation === 'remove') {
        positions = _.without(positions, position.id);
        if (positions.length === 0)
          positions = undefined;
      }

      user.positions = positions;
      user.markModified('positions');
      user.save(function (err) {
        if (err) callback(err);
        callback();
      });
    }, function (err) {
      if (err) return cb(err);
      cb(null);
    });
  });
}

positionSchema.statics.createPosition = function (position, cb) {
  position.save(function (err, savedPosition) {
    if (err)  return cb(err);
    updateUsers(savedPosition.owners, savedPosition, 'add', function(err){
      cb(err, savedPosition);
    });
  });
};

positionSchema.statics.deletePosition = function (position, cb) {
  position.remove(function (err, deletedPosition) {
    if (err)  return cb(err);
    updateUsers(deletedPosition.owners, deletedPosition, 'remove', function(err){
      cb(err, deletedPosition);
    });
  });
};

positionSchema.statics.updatePosition = function (position, cb) {
  this.findOne({_id: position._id}, function (err, oldPosition) {
    if (err) return cb(err);

    var oldOwners = _.difference(arrayToString(oldPosition.owners), arrayToString(position.owners));
    var newOwners = _.difference(arrayToString(position.owners), arrayToString(oldPosition.owners));
    position.save(function (err, savedPosition) {
      if (err)  return cb(err);
      updateUsers(oldOwners, savedPosition, 'remove', function (err) {
        if (err) return cb(err);
        updateUsers(newOwners, savedPosition, 'add', function(err){
          cb(err, savedPosition);
        });
      });
    });
  });
};

positionSchema.index({company: 1, name: 1}, {unique: true});

positionSchema.plugin(timestamps);
positionSchema.plugin(merge);

mongoose.model('Position', positionSchema);