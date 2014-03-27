'use strict';

var fs = require('fs'),
    sessions = require('../controllers/sessions'),
    emails = require('../controllers/emails'),
    signups = require('../controllers/signups'),
    mails = require('../controllers/mails'),
    users = require('../controllers/users');

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
    app.get('/api/mails/:mailId', mails.get);
    app.param('mailId', sessions.requiresLogin, mails.load);

    app.post('/api/users', sessions.requiresLogin, users.create);
    app.get('/api/users', sessions.requiresLogin, users.list);
    app.get('/api/users/:userId', users.get);
    app.put('/api/users/:userId', users.update);
    app.delete('/api/users/:userId', users.delete);
    app.param('userId', sessions.requiresLogin, users.load);

    app.all('/api/*', function (req, res) {
        res.send(404);
    });

    app.all('/api/*', function (err, req, res, next) {
        console.log(err);
        res.status(500).json({message: 'Internal Server Error'});
    });

    app.get('*', function (req, res) {
        res.render('index', {
            bootstrappedUser: req.user && req.user.info
        });
    });
};