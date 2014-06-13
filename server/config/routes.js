'use strict';

var express = require('express'),
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
  reviews = require('../controllers/reviews'),
  eventSettings = require('../controllers/eventSettings'),
  counts = require('../controllers/counts'),
  systemOperations = require('../controllers/systemOperations'),
  resumeReports = require('../controllers/resumeReports'),
  interviewReports = require('../controllers/interviewReports'),
  applierRejectReasons = require('../controllers/applierRejectReasons');

module.exports = function (app) {
  var apiRouter = express.Router();
  var publicApiRouter = express.Router();

  publicApiRouter.route('/sessions')
    .post(sessions.authenticate)
    .delete(sessions.logout);

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

  apiRouter.route('/emailCount')
    .get(emails.count);

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

  apiRouter.route('/resumeCounts')
    .get(resumes.counts);

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
  apiRouter.route('/interviews/:id')
    .get(interviews.get)
    .put(interviews.update);


  apiRouter.route('/reviews')
    .get(reviews.list)
    .post(reviews.create);

  apiRouter.route('/applyPositions')
    .get(interviews.applyPositions);

  apiRouter.route('/applierRejectReasons')
    .get(applierRejectReasons.list);

  apiRouter.route('/counts')
    .get(counts.get);

  apiRouter.route('/systemOperations/recreateAllJobs')
    .post(systemOperations.recreateAllJobs);
  apiRouter.route('/systemOperations/recreateFetchEmailJobs')
    .post(systemOperations.recreateFetchEmailJobs);
  apiRouter.route('/systemOperations/synchronizeEsToDb')
    .post(systemOperations.synchronizeEsToDb);
  apiRouter.route('/systemOperations/reparseMails')
    .post(systemOperations.reparseMails);

  apiRouter.route('/resumeReports/counts')
    .get(resumeReports.counts);
  apiRouter.route('/resumeReports/applyPositions')
    .get(resumeReports.applyPositions);
  apiRouter.route('/resumeReports/channels')
    .get(resumeReports.channels);
  apiRouter.route('/resumeReports/summaries')
    .get(resumeReports.summaries);
  apiRouter.route('/interviewReports/counts')
    .get(interviewReports.counts);
  apiRouter.route('/interviewReports/summaries')
    .get(interviewReports.summaries);

  apiRouter.use(function (err, req, res, next) {
    if (!err) return next();
    logger.error(err.stack);
    res.send(500, {message: 'Internal Server Error',
      stack: err.stack});
  });

  app.use('/api', apiRouter);
  app.use('/publicApi', publicApiRouter);

  app.get('/', function (req, res) {
    res.render('index', {
      bootstrappedUser: req.user
    });
  });

  app.use(function (req, res) {
    logger.error('request unknown url ' + req.url);

    res.status(404);
    if (req.accepts('html')) {
      return res.render('404', { url: req.url });
    }

    if (req.accepts('json')) {
      return res.send({ error: 'Not found' });
    }

    res.type('txt').send('Not found');
  });

};