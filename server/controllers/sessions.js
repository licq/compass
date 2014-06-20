'use strict';

var mongoose = require('mongoose'),
  Token = mongoose.model('Token'),
  passport = require('passport'),
  Role = mongoose.model('Role');

exports.authenticate = function (req, res, next) {
  passport.authenticate('local',
    { badRequestMessage: '用户名或密码不正确' },
    function (err, user, info) {
      var error = err || info;
      if (error) return res.json(401, error);
      req.logIn(user, function (err) {
          if (err) return res.json(err);
          if (req.body.remember_me) {
            Token.create({user: req.user._id}, function (err, token) {
              if (!err) {
                res.cookie('remember_me', token.id, { path: '/', httpOnly: true, maxAge: 604800000 });
              }
              return req.user.withPermissions(function (err, user) {
                res.json(user);
              });
            });
          } else {
            return req.user.withPermissions(function (err, user) {
              res.json(user);
            });
          }
        }
      );
    })(req, res, next);
};

exports.logout = function (req, res) {
  req.logout();
  res.clearCookie('remember_me');
  res.send(200);
};

exports.requiresLogin = function (req, res, next) {
  if (req.isAuthenticated()) return next();
  res.send(401);
};