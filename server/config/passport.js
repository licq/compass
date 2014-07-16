'use strict';

var mongoose = require('mongoose'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  User = mongoose.model('User');

module.exports = function () {
  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function (id, done) {
    User.findOne({ _id: id })
      .populate('positions', 'name')
      .select('-hashed_password -salt')
      .exec(function (err, user) {
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  });

  passport.use(new LocalStrategy({ usernameField: 'email' },
    function (email, password, done) {
      User.findOne({ email: email })
        .exec(function (err, user) {
        if (err) return done(err);
        if (!user || !user.authenticate(password)) {
          return done(null, false, { message: '用户名或密码不匹配' });
        }
        return done(null, user);
      });
    }
  ));
};