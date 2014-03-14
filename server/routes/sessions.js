'use strict';

var mongoose = require('mongoose'),
    Token = mongoose.model('Token'),
    passport = require('passport');

module.exports = function (app) {

    app.get('/logout', function (req, res) {
        res.clearCookie('remember_me');
        req.logout();
        res.redirect('/login');
    });

    function passportAuthenticate(req, res, next) {
        var auth = passport.authenticate('local', function (err, user) {
            if (err) return next(err);
            if (!user) return res.send({
                success: false,
                reason: '用户名或密码不正确'
            });
            next();
        });
        auth(req, res, next);
    }

    app.post('/sessions', passportAuthenticate,
        function (req, res, next) {
            if (!req.body.remember_me) {
                return next();
            }

            Token.save(req.user.id, function (err, tokenId) {
                if (err) return next(err);
                res.cookie('remember_me', tokenId, { path: '/', httpOnly: true, maxAge: 604800000 }); // 7 days
                return next();
            });
        },
        function (req, res) {
            return res.send({
                success: true,
                user: req.user
            });
        }
    )
};