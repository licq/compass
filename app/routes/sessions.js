'use strict';


module.exports = function (app, passport) {

    app.get('/signin', function (req, res) {
        res.render('sessions/signin', {
            title: 'Signin',
            message: req.flash('error')
        });
    });

    app.get('/signout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.post('/sessions',
        passport.authenticate('local', {
            failureRedirect: '/signin',
            successRedirect: '/home',
            failureFlash: true
        }));
}