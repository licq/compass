'use strict';

var mongoose = require('mongoose'),
  Position = mongoose.model('Position'),
  User = mongoose.model('User'),
  _ = require('lodash');

exports.list = function (req, res, next) {
  var fields = req.query.fields || ['name owners evaluationCriterions department createdAt'];
  if (!Array.isArray(fields)) {
    fields = [fields];
  }
  var query = {company: req.user.company};

  Position.find(query)
    .populate('owners', 'name')
    .select(fields.join(' '))
    .exec(function (err, positions) {
      if (err) return next(err);
      return res.json(positions);
    });
};

exports.toBeAdded = function (req, res, next) {
  mongoose.model('Resume').distinct('applyPosition')
    .where({company: req.user.company})
    .exec(function (err, applyPositions) {
      if (err) return next(err);
      Position.find({company: req.user.company})
        .select('name').exec(function (err, createdPositions) {
          if (err) return next(err);
          createdPositions = _.pluck(createdPositions, 'name');
          res.json(_.difference(applyPositions, createdPositions));
        });
    });
};

exports.create = function (req, res) {
  req.body.company = req.user.company;
  Position.createPosition(req.body, function (err) {
    if (err) {
      if (err.code === 11000 || err.code === 11001) {
        return res.json(400, {message: '职位名已经存在'});
      } else {
        return res.json(400, {message: err.message});
      }
    }
    res.end();
  });
};

exports.delete = function (req, res, next) {
  Position.deletePosition(req.position, function (err) {
    if (err) return next(err);
    res.end();
  });
};

exports.get = function (req, res) {
  res.json(req.position);
};

exports.update = function (req, res, next) {
  req.position.merge(req.body);
  Position.updatePosition(req.position, function (err) {
    if (err) return next(err);
    res.end();
  });
};

exports.load = function (req, res, next) {
  Position.findOne({_id: req.params.id, company: req.user.company})
    .exec(function (err, position) {
      if (err) return next(err);
      if (!position) return res.send(404, {message: 'not found'});
      req.position = position;
      next();
    });
};