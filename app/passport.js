'use strict';

var User = require('./models/user'),
    LocalStrategy = require('passport-local').Strategy,
    RememberMeStrategy = require('passport-remember-me').Strategy,
    Token = require('./models/token');

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
            usernameField: 'email'
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

    passport.use(new RememberMeStrategy(
        function (token, done) {
            Token.consume(token, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false);
                }
                return done(null, user);
            });
        },
        function (user, done) {
            Token.save(user.id, function (err, tokenId) {
                if (err) {
                    return done(err);
                }
                return done(null, tokenId);
            });
        }
    ));
};