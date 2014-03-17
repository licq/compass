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

    app.get('/api/emails', emails.list);
    app.post('/api/emails', emails.create);
    app.delete('/api/emails/:id', emails.delete);

    app.all('/api/*', function (req, res) {
        res.send(404);
    });

    app.get('*', function (req, res) {
        res.render('index', {
            bootstrappedUser: req.user
        });
    });
};