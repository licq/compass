'use strict';

module.exports = function (app) {

    app.get('/', function (req, res) {
        if (!req.user) {
            res.render('index');
        } else {
            res.redirect('/home');
        }
    });

    app.get('/home', function (req, res) {
        if (req.user) {
            res.render('home', {
                user: req.user ? JSON.stringify(req.user) : 'null'
            })
        } else {
            res.redirect('/login');
        }
    });

};
