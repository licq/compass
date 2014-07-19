'use strict';

var mongoose = require('mongoose'),
  Resume = mongoose.model('Resume'),
  _ = require('lodash');

exports.list = function (req, res, next) {
  req.query.company = req.user.company;
//  req.query.positions = req.user.positions;
//  if (params.positions && params.positions.length > 0) {
//    var positionsFilter = makeTermFilter(_.map(params.positions, 'name'), 'applyPosition.original');
//    filters.push(positionsFilter);
//  }
  req.query.sort = [
    {
      createdAt: {order: 'desc'}
    }
  ];
  Resume.query(req.query, function (err, results) {
    if (err) return next(err);
    return res.json(results);
  });
};

exports.get = function (req, res) {
  res.json(req.resume);
};

exports.update = function (req, res, next) {
  req.resume.status = req.query.status;
  req.resume.saveAndIndexSync(function (err) {
    if (err) return next(err);
    res.send(200);
  });
};

exports.load = function (req, res, next) {
  var query = Resume.findOne({_id: req.params.id});

  if (req.user.positions && req.user.positions.length > 0) {
    var positions = _.map(req.user.positions, 'name');
    query.where('applyPosition').in(positions);
  }

  query.exec(function (err, resume) {
    if (err) return next(err);
    if (!resume) return res.send(404, {message: 'not found'});
    req.resume = resume;
    next();
  });
};

