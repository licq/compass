'use strict';

var mongoose = require('mongoose'),
    Token = mongoose.model('Token'),
    passport = require('passport');

module.exports = function (app) {

    app.get('/login', function (req, res) {
        res.render('sessions/login2.jade', {
            title: 'Login',
            message: req.flash('error')
        });
    });

    app.get('/logout', function (req, res) {
        res.clearCookie('remember_me');
        req.logout();
        res.redirect('/login');
    });

    app.post('/sessions',
        passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash: true,
            badRequestMessage: '用户名或密码不正确'
        }),
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
            res.redirect('/home');
        });
};