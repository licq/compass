'use strict';

var fs = require('fs'),
    sessions = require('../controllers/sessions'),
    emails = require('../controllers/emails'),
    signups = require('../controllers/signups'),
    mails = require('../controllers/mails'),
    users = require('../controllers/users'),
    resumes = require('../controllers/resumes'),
    emailTemplates = require('../controllers/emailTemplates'),
    logger = require('./winston').logger();

module.exports = function (app) {

    app.post('/api/sessions', sessions.authenticate, sessions.rememberMe);
    app.delete('/api/sessions', sessions.clearRememberMe, sessions.logout);

    app.post('/api/signups', signups.create);
    app.put('/api/signups/:code', signups.activate);

    app.get('/api/emails', sessions.requiresLogin, emails.list);
    app.post('/api/emails', sessions.requiresLogin, emails.create);
    app.delete('/api/emails/:emailId', emails.delete);
    app.get('/api/emails/:emailId', emails.get);
    app.put('/api/emails/:emailId', emails.update);
    app.param('emailId', sessions.requiresLogin, emails.load);

    app.get('/api/mails', sessions.requiresLogin, mails.list);
    app.get('/api/mails/:id', sessions.requiresLogin, mails.get);
    app.put('/api/mails/:id', sessions.requiresLogin, mails.parse);
    app.get('/api/mails/:id/html', sessions.requiresLogin, mails.getHtml);

    app.post('/api/users', sessions.requiresLogin, users.create);
    app.get('/api/users', sessions.requiresLogin, users.list);
    app.get('/api/users/:userId', users.get);
    app.put('/api/users/:userId', users.update);
    app.delete('/api/users/:userId', users.delete);
    app.param('userId', sessions.requiresLogin, users.load);

    app.get('/api/resumes', sessions.requiresLogin, resumes.list);
    app.get('/api/resumes/:resumeId', resumes.get);
    app.param('resumeId', sessions.requiresLogin, resumes.load);

    app.get('/api/emailTemplates', sessions.requiresLogin, emailTemplates.list);
    app.post('/api/emailTemplates', sessions.requiresLogin, emailTemplates.create);

    app.all('/api/*', function (req, res) {
        logger.error('request unknown url ' + req.url);
        res.send(404);
    });

    app.all('/api/*', function (err, req, res, next) {
        logger.error(err);
        res.status(500).json({message: 'Internal Server Error',
            stack: err.stack});
    });

    app.get('*', function (req, res) {
        res.render('index', {
            bootstrappedUser: req.user && req.user.info
        });
    });
};