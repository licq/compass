'use strict';

var fs = require('fs'),
  sessions = require('../controllers/sessions'),
  emails = require('../controllers/emails'),
  signups = require('../controllers/signups'),
  mails = require('../controllers/mails'),
  users = require('../controllers/users'),
  resumes = require('../controllers/resumes'),
  emailTemplates = require('../controllers/emailTemplates'),
  evaluationCriterions = require('../controllers/evaluationCriterions'),
  applications = require('../controllers/applications'),
  logger = require('./winston').logger(),
  companies = require('../controllers/companies'),
  events = require('../controllers/events');

module.exports = function (app) {
  app.post('/api/sessions', sessions.authenticate, sessions.rememberMe);
  app.delete('/api/sessions', sessions.clearRememberMe, sessions.logout);

  app.post('/api/signups', signups.create);
  app.put('/api/signups/:code', signups.activate);

  app.all('/api/*', sessions.requiresLogin);
  app.get('/api/emails', emails.list);
  app.post('/api/emails', emails.create);
  app.delete('/api/emails/:emailId', emails.delete);
  app.get('/api/emails/:emailId', emails.get);
  app.put('/api/emails/:emailId', emails.update);
  app.param('emailId', emails.load);

  app.get('/api/mails', mails.list);
  app.get('/api/mails/:id', mails.get);
  app.put('/api/mails/:id', mails.parse);
  app.get('/api/mails/:id/html', mails.getHtml);

  app.post('/api/users', users.create);
  app.get('/api/users', users.list);
  app.get('/api/users/:userId', users.get);
  app.put('/api/users/:userId', users.update);
  app.delete('/api/users/:userId', users.delete);
  app.param('userId', users.load);

  app.get('/api/companies', companies.list);
  app.get('/api/companies/:companyId', companies.get);
  app.param('companyId', companies.load);

  app.get('/api/resumes', resumes.list);
  app.get('/api/resumes/:resumeId', resumes.get);
  app.param('resumeId', resumes.load);

  app.get('/api/emailTemplates', emailTemplates.list);
  app.post('/api/emailTemplates', emailTemplates.create);
  app.delete('/api/emailTemplates/:emailTemplateId', emailTemplates.delete);
  app.get('/api/emailTemplates/:emailTemplateId', emailTemplates.get);
  app.put('/api/emailTemplates/:emailTemplateId', emailTemplates.update);
  app.param('emailTemplateId', emailTemplates.load);

  app.get('/api/evaluationCriterions', evaluationCriterions.get);
  app.put('/api/evaluationCriterions', evaluationCriterions.update);

  app.get('/api/applications', applications.list);
  app.get('/api/applications/:applicationId', applications.get);
  app.put('/api/applications/:applicationId', applications.update);
  app.param('applicationId', applications.load);

  app.get('/api/events', events.list);
  app.post('/api/events', events.create);

  app.all('/api/*', function (req, res) {
    logger.error('request unknown url ' + req.url);
    res.send(404);
  });

  app.all('/api/*', function (err, req, res, next) {
    logger.error(err.stack);
    res.status(500).json({message: 'Internal Server Error',
      stack: err.stack});
  });

  app.get('*', function (req, res) {
    res.render('index', {
      bootstrappedUser: req.user && req.user.info
    });
  });
};