'use strict';

var fs = require('fs'),
    sessions = require('../controllers/sessions'),
    emails = require('../controllers/emails'),
    signups = require('../controllers/signups');

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

    app.all('/api/*', function (req, res) {
        res.send(404);
    });

    app.get('*', function (req, res) {
        res.render('index', {
            bootstrappedUser: req.user && req.user.info
        });
    });
};