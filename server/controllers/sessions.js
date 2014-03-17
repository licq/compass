'use strict';

var mongoose = require('mongoose'),
    Token = mongoose.model('Token'),
    passport = require('passport');

exports.authenticate = function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        var error = err || info;
        if (error) return res.json(401, error);

        req.logIn(user, function (err) {
            if (err) return res.json(err);
            return next();
        });
    })(req, res, next);
};

exports.rememberMe = function (req, res, next) {
    if (!req.body.remember_me) {
        return res.json(req.user);
    }

    Token.save(req.user.id, function (err, tokenId) {
        if (!err) {
            res.cookie('remember_me', tokenId, { path: '/', httpOnly: true, maxAge: 604800000 });
        }
        res.json(req.user);
    });
};

exports.clearRememberMe = function (req, res, next) {
    res.clearCookie('remember_me');
    next();
};

exports.logout = function (req, res) {
    req.logout();
    res.send(200);
};

exports.requiresLogin = function (req, res, next) {
    if (req.isAuthenticated()) return next();
    res.send(401);
};
