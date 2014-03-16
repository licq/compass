'use strict';

var fs = require('fs'),
    sessions = require('../controllers/sessions'),
    emails = require('../controllers/emails'),
    registrations = require('../controllers/registrations');

module.exports = function (app) {

    app.post('/api/sessions', sessions.authenticate, sessions.rememberMe);
    app.delete('/api/sessions', sessions.clearRememberMe, sessions.logout);

    app.post('/registrations', registrations.create);
    app.get('/registrations/activate/:code', registrations.activate);

    app.get('/api/emails', emails.list);
    app.post('/api/emails', emails.create);

    app.all('/api/*', function (req, res) {
        res.send(404);
    });

    app.get('*', function (req, res) {
        res.render('index', {
            bootstrappedUser: req.user
        });
    });
};