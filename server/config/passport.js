'use strict';

var mongoose = require('mongoose'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  RememberMeStrategy = require('passport-remember-me').Strategy,
  Token = mongoose.model('Token'),
  User = mongoose.model('User');

module.exports = function () {
  passport.serializeUser(function (user, done) {
    console.log('serializeUser', user.id);
    if (user) {
      done(null, user._id);
    }
  });

  passport.deserializeUser(function (id, done) {
    console.log('deserializeUser',id);
    User.findOne({ _id: id }).exec(function (err, user) {
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  });

  passport.use(new LocalStrategy({ usernameField: 'email' },
    function (email, password, done) {
      console.log('local strategy');
      User.findOne({ email: email }).exec(function (err, user) {
        if (err) return done(err);
        if (!user || !user.authenticate(password)) {
          return done(null, false, { message: '用户名或密码不匹配' });
        }
        return done(null, user);
      });
    }
  ));

  passport.use(new RememberMeStrategy(
    function (tokenId, done) {
      console.log('remember me strategy');
      Token.findByIdAndRemove(tokenId, function (err, token) {
        if (err) return done(err);
        if (!token) return done(null, false);

        User.findById(token.user, function (err, user) {
          if (err) return done(err);
          if (!user) return done(null, false);

          return done(null, user);
        });
      });
    },
    function (user, done) {
      console.log('create token');
      Token.create({user: user.id}, function (err, token) {
        if (err) return done(err);
        return done(null, token._id);
      });
    }
  ));
};