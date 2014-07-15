'use strict';

var mongoose = require('mongoose'),
  Position = mongoose.model('Position'),
  User = mongoose.model('User'),
  _ = require('lodash');

exports.list = function (req, res, next) {

  var query = Position.find({ company: req.user.company });
  if (req.query.byUserId) {
    query = query.select('name').where('owners',req.user._id);
  } else {
    query = query.populate('owners', 'name')
      .select('name owners evaluationCriterions department createdAt');
  }
  query.exec(function (err, positions) {
    if (err) return next(err);
    return res.json(positions);
  });
};

exports.create = function (req, res) {
  var position = new Position(req.body);
  position.company = req.user.company;
  position.save(function (err) {
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
  req.position.remove(function (err) {
    if (err) return next(err);
    res.end();
  });
};

exports.get = function (req, res) {
  res.json(req.position);
};

exports.update = function (req, res, next) {
  req.position.merge(req.body);
  req.position.save(function (err) {
    if (err) return next(err);
    res.end();
  });
};

exports.load = function (req, res, next) {
  Position.findOne({_id: req.params.id, company: req.user.company})
    .select('name owners evaluationCriterions department createdAt')
    .exec(function (err, position) {
      if (err) return next(err);
      if (!position) return res.send(404, {message: 'not found'});
      req.position = position;
      next();
    });
};

//exports.getByUserId = function (req, res, next) {
//  Position.find()
//    .select('name')
//    .where('owners', req.user._id)
//    .exec(function (err, positions) {
//      if (err) return next(err);
//      if (!positions) return res.send(404, {message: 'not found'});
//      req.positions = positions;
//      next();
//    });
//};