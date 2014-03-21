'use strict';

var express = require('express'),
    swig = require('swig'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    kue = require('kue'),
    mongoStore = require('connect-mongo')(express);

module.exports = function (app, config) {
    app.configure('development', function () {
        swig.setDefaults({cache: false});
        app.set('view cache', false);
    });
    app.configure(function () {
        app.engine('html', swig.renderFile);
        app.set('view engine', 'html');
        app.set('views', config.rootPath + '/server/views');

        app.use('/tasks', kue.app);

        app.use(express.favicon());
        app.use(express.logger('dev'));
        app.use(express.compress({
            filter: function (req, res) {
                return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
            },
            level: 9
        }));
        app.use(express.static(config.rootPath + '/public'));
        app.use(express.cookieParser());
        app.use(express.urlencoded());
        app.use(express.json());
        app.use(express.methodOverride());
        app.use(express.session({
            secret: 'This is another secret',
            store: new mongoStore({
                db: mongoose.connection.db,
                collection: 'sessions',
                auto_reconnect: true
            })
        }));


        app.use(passport.initialize());
        app.use(passport.session());
        app.use(passport.authenticate('remember-me'));
        app.use(app.router);

    });

    app.configure('development', function () {
        app.use(express.errorHandler());
    });
};
