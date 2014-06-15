'use strict';

var mongoose = require('mongoose'),
  Role = mongoose.model('Role'),
  _ = require('lodash');

exports.list = function (req, res, next) {
  Role.find({
    company: req.user.company,
  }).exec(function (err, roles) {
    if (err) return next(err);
    return res.json(roles);
  });
};

exports.create = function (req, res) {
  var role = new Role(req.body);
  role.company = req.user.company;
  role.name = req.body.name;
  role.permissons = req.body.permissions;
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
  //todo 判断是否可以删除角色
  req.role.remove(function (err) {
    if (err) return next(err);
    res.end();
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