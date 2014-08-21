'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  _ = require('lodash');

exports.list = function (req, res, next) {
  var fields = req.query.fields || ['name', 'email', 'department', 'company', 'title', 'deleted', 'createdAt', 'role', 'positions'];
  if (!Array.isArray(fields)) {
    fields = [fields];
  }
  var query = {company: req.user.company};
  if (req.query.deleted)
    query.deleted = req.query.deleted;
  User.find(query)
    .populate('role', 'name')
    .populate('positions', 'name')
    .select(fields.join(' '))
    .exec(function (err, users) {
      if (err) return next(err);
      return res.json(users);
    });
};

exports.create = function (req, res) {
  var user = new User(req.body);
  user.company = req.user.company;
  user.createdBy = req.user._id;
  User.createUser(user, function (err) {
    if (err) {
      if (err.code === 11000 || err.code === 11001) {
        return res.json(400, {message: '邮箱地址已经存在'});
      } else {
        return res.json(400, {message: err.message});
      }
    }
    res.end();
  });
};

exports.delete = function (req, res, next) {
  User.count({company: req.user.company, deleted: false}, function (err, count) {
    if (err) return next(err);
    if (count > 1) {
      User.deleteUser(req.loadedUser, function (err) {
        if (err) return next(err);
        res.end();
      });
    } else {
      return res.json(400, {message: '这是贵公司最后一个用户，不能删除'});
    }
  });
};

exports.enable = function (req, res, next) {
  req.loadedUser.deleted = false;
  req.loadedUser.save(function (err) {
    if (err) return next(err);
    res.end();
  });
};

exports.get = function (req, res) {
  res.json(req.loadedUser);
};

exports.update = function (req, res, next) {
  req.loadedUser.merge(req.body);
  if (req.body.password) req.loadedUser.password = req.body.password;
  User.updateUser(req.loadedUser, function (err) {
    if (err) return next(err);
    res.end();
  });
};

exports.load = function (req, res, next) {
  User.findOne({_id: req.params.id, company: req.user.company})
    .populate('role', 'name permissions')
    .select('name email company title department role positions')
    .exec(function (err, loadedUser) {
      if (err) return next(err);
      if (!loadedUser) return res.send(404, {message: 'not found'});
      req.loadedUser = loadedUser;
      next();
    });
};


exports.isSystemAdmin = function (req, res, next) {
  req.user.isSystemAdmin(function (err, result) {
    if (err) return next(err);
    if (result === true) return next();
    res.send(403, {message: 'Forbidden'});
  });
};