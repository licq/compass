'use strict';

var request = require('supertest'),
    app = require('../../../server');

exports.login = function login(user, cb) {
    request(app).post('/api/sessions')
        .send({email: user.email, password: user.password})
        .expect(200)
        .end(function (err, res) {
            var cookies = res.headers['set-cookie'].pop().split(';')[0];
            cb(cookies);
        });
};
