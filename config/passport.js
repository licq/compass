'use strict';

var mongoose = require('mongoose'),
    LocalStrategy = require('passport-local').Strategy;

var User = mongoose.model('User'),
    config = require('./config');

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findOne({
            _id: id
        }, '-salt -hashed_password', function (err, user) {
            done(err, user);
        });
    });

    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function (email, password, done) {
            User.findOne({
                email: email
            }, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {
                        message: '用户名或密码不匹配'
                    });
                }
                if (!user.authenticate(password)) {
                    return done(null, false, {
                        message: '用户名或密码不匹配'
                    });
                }
                return done(null, user);
            });
        }
    ));
};