'use strict';

var Token = require('../models/token');

module.exports = function (app, passport) {

    app.get('/signin', function (req, res) {
        res.render('sessions/signin', {
            title: 'Signin',
            message: req.flash('error')
        });
    });

    app.get('/signout', function (req, res) {
        res.clearCookie('remember_me');
        req.logout();
        res.redirect('/');
    });

    app.post('/sessions',
        passport.authenticate('local', {
            failureRedirect: '/signin',
            failureFlash: true
        }),
        function (req, res, next) {
            if (!req.body.remember_me) {
                return next();
            }

            Token.save(req.user.id, function (err, tokenId) {
                if (err) return done(err);
                res.cookie('remember_me', tokenId, { path: '/', httpOnly: true, maxAge: 604800000 }); // 7 days
                return next();
            });
        },
        function (req, res) {
            res.redirect('/home');
        });
};