'use strict';

var fs = require('fs'),
  express = require('express'),
  sessions = require('../controllers/sessions'),
  emails = require('../controllers/emails'),
  signups = require('../controllers/signups'),
  mails = require('../controllers/mails'),
  users = require('../controllers/users'),
  resumes = require('../controllers/resumes'),
  evaluationCriterions = require('../controllers/evaluationCriterions'),
  applications = require('../controllers/applications'),
  logger = require('./winston').logger(),
  companies = require('../controllers/companies'),
  events = require('../controllers/events'),
  interviews = require('../controllers/interviews'),
  eventSettings = require('../controllers/eventSettings');

module.exports = function (app) {
  var apiRouter = express.Router();
  var publicApiRouter = express.Router();

  publicApiRouter.route('/sessions')
    .post(sessions.authenticate, sessions.rememberMe)
    .delete(sessions.clearRememberMe, sessions.logout);

  publicApiRouter.route('/signups').post(signups.create);
  publicApiRouter.route('/signups/:code').put(signups.activate);

  apiRouter.use(sessions.requiresLogin);
  apiRouter.route('/emails')
    .get(emails.list)
    .post(emails.create);

  apiRouter.route('/emails/:id')
    .all(emails.load)
    .get(emails.get)
    .delete(emails.delete)
    .put(emails.update);

  apiRouter.route('/mails')
    .get(mails.list);

  apiRouter.route('/mails')
    .get(mails.list);
  apiRouter.route('/mails/:id')
    .get(mails.get)
    .put(mails.parse);

  apiRouter.route('/mails/:id/html')
    .get(mails.getHtml);

  apiRouter.route('/users')
    .post(users.create)
    .get(users.list);
  apiRouter.route('/users/:id')
    .all(users.load)
    .get(users.get)
    .put(users.update)
    .delete(users.delete);

  apiRouter.route('/companies')
    .get(companies.list);
  apiRouter.route('/companies/:id')
    .all(companies.load)
    .get(companies.get);

  apiRouter.route('/resumes')
    .get(resumes.list);
  apiRouter.route('/resumes/:id')
    .all(resumes.load)
    .get(resumes.get);


  apiRouter.route('/eventSettings')
    .get(eventSettings.get);
  apiRouter.route('/eventSettings')
    .post(eventSettings.save);

  apiRouter.route('/evaluationCriterions')
    .get(evaluationCriterions.get)
    .put(evaluationCriterions.update);

  apiRouter.route('/applications')
    .get(applications.list);
  apiRouter.route('/applications/:id')
    .all(applications.load)
    .get(applications.get)
    .put(applications.update);

  apiRouter.route('/events')
    .get(events.list)
    .post(events.create);
  apiRouter.route('/events/:id')
    .put(events.update)
    .delete(events.delete);
  apiRouter.route('/interviews')
    .get(interviews.list);

  apiRouter.use(function (err, req, res, next) {
    if (!err) return next();
    logger.error(err.stack);
    res.send(500, {message: 'Internal Server Error',
      stack: err.stack});
  });

  apiRouter.use(function (req, res) {
    logger.error('request unknown url /api' + req.url);
    res.send(404);
  });

  app.use('/api', apiRouter);
  app.use('/publicApi', publicApiRouter);

  app.get('*', function (req, res) {
    res.render('index', {
      bootstrappedUser: req.user
    });
  });
};