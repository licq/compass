'use strict';

var express = require('express'),
    swig = require('./../swig'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    mongoStore = require('connect-mongo')(express),
    flash = require('connect-flash');

module.exports = function (app, config) {
    app.configure(function () {
        app.engine('html', swig.renderFile);
        app.set('view engine', 'html');
        app.set('views', config.rootPath + '/server/views');

        app.use(express.favicon());
        app.use(express.logger(config.log));
        app.use(express.compress({
            filter: function (req, res) {
                return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
            },
            level: 9
        }));
        app.use(express.cookieParser());
        app.use(express.urlencoded());
        app.use(express.json());
        app.use(express.methodOverride());
        app.use(express.session({
            secret: config.sessionSecret,
            store: new mongoStore({
                db: mongoose.connection.db,
                collection: config.sessionCollection
            })
        }));

        app.use(passport.initialize());
        app.use(passport.session());
        app.use(flash());
        app.use(passport.authenticate('remember-me'));
        app.use(app.router);
        app.use(express.static(config.rootPath + '/public'));

        app.use(function (err, req, res, next) {
            if (~err.message.indexOf('not found')) {
                return next();
            }
            console.error(err.stack);
            res.status(500).render('500', {
                error: err.stack
            });
        });

        app.use(function (req, res) {
            res.status(404).render('404', {
                url: req.originalUrl,
                error: 'Not found'
            });
        });

    });
};
