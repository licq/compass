'use strict';

module.exports = function (app) {

    app.get('/', function (req, res) {
        if (!req.user) {
            res.render('index2.jade');
        } else {
            res.redirect('/home');
        }
    });

    app.get('/home', function (req, res) {
        if (req.user) {
            res.render('home2.jade',{
                user: req.user
            });
        } else {
            res.redirect('/login');
        }
    });

};
