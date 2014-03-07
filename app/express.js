'use strict';

var express = require('express'),
    swig = require('./swig'),
    mongoStore = require('connect-mongo')(express),
    flash = require('connect-flash'),
    helpers = require('view-helpers'),
    config = require('./config');

module.exports = function (app, passport, db) {
    app.set('showStackError', true);
    app.locals.pretty = true;
    if (process.env.NODE_ENV === 'production') {
        app.locals.cache = 'memory';
    }

    app.engine('html',swig.renderFile);
    app.set('view engine', 'html');
    app.set('views', config.root + '/app/views');
    app.enable('jsonp callback');

    app.configure(function () {
        app.use(express.favicon());

        if (process.env.NODE_ENV === 'development') {
            app.use(express.logger('dev'));
            app.set('view cache', false);
        }

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
                db: db.connection.db,
                collection: config.sessionCollection
            })
        }));
        app.use(helpers(config.app.name));

        app.use(passport.initialize());
        app.use(passport.session());
        app.use(flash());
        app.use(passport.authenticate('remember-me'));
        app.use(app.router);
        app.use(express.static(config.root + '/public'));

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
