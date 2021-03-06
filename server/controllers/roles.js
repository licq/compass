'use strict';

var mongoose = require('mongoose'),
  Role = mongoose.model('Role'),
  User = mongoose.model('User'),
  _ = require('lodash');

exports.list = function (req, res, next) {
  Role.find({
    company: req.user.company
  }).exec(function (err, roles) {
    if (err) return next(err);
    return res.json(roles);
  });
};

exports.create = function (req, res) {
  var role = new Role(req.body);
  role.company = req.user.company;
  role.save(function (err) {
    if (err) {
      if (err.code === 11000 || err.code === 11001) {
        return res.json(400, {message: '角色名已经存在'});
      } else {
        return res.json(400, {message: err.message});
      }
    }
    res.end();
  });
};

exports.delete = function (req, res, next) {
  User.count({company: req.user.company, role: req.role._id, deleted: false})
    .exec(function (err, count) {
      if (err) return next(err);
      if (count > 0) {
        return res.json(400, {message: '还有' + count + '个用户属于' + req.role.name + '这个角色,不能删除'});
      } else {
        req.role.remove(function (err) {
          if (err) return next(err);
          res.end();
        });
      }
    });
};

exports.get = function (req, res) {
  res.json(req.role);
};

exports.update = function (req, res, next) {
  req.role.merge(req.body);
  req.role.save(function (err) {
    if (err) return next(err);
    res.end();
  });
};

exports.load = function (req, res, next) {
  Role.findOne({_id: req.params.id, company: req.user.company})
    .exec(function (err, role) {
      if (err) return next(err);
      if (!role) return res.send(404, {message: 'not found'});
      req.role = role;
      next();
    });
};