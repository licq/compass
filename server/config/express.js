'use strict';

var express = require('express'),
  swig = require('swig'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  kue = require('kue'),
  session = require('express-session'),
  mongoStore = require('connect-mongo')(session),
  winston = require('./winston'),
  expressWinston = require('express-winston');

module.exports = function (app, config) {
  if ('development' === app.get('env')) {
    swig.setDefaults({cache: false});
    app.set('view cache', false);
  }

  app.engine('html', swig.renderFile);
  app.set('view engine', 'html');
  app.set('views', config.rootPath + '/server/views');

  app.use('/tasks', kue.app);
//  app.use(require('serve-favicon')('public/img/favicon/favicon.png'));
  app.use(require('compression')({
    filter: function (req, res) {
      return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
    },
    threshold: 512
  }));
  app.use(express.static(config.rootPath + '/public'));
  app.use(expressWinston.logger({
    transports: winston.transports,
    meta: false,
    msg: "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  }));
  app.use(require('cookie-parser')());
  app.use(require('body-parser')());
  app.use(require('method-override')());
  app.use(session({
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

  require('./routes')(app);

  app.route('/app/*', function (req, res) {
    res.send(404);
  });

  app.use(expressWinston.errorLogger({
    transports: winston.transports
  }));

  if ('development' === app.get('env')) {
    app.use(require('errorHandler')());
  }
};