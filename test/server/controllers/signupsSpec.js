'use strict';

var app = require('../../../server'),
    request = require('supertest'),
    mongoose = require('mongoose'),
    Signup = mongoose.model('Signup');


var signup;

describe('singups', function () {
    beforeEach(function (done) {
        Signup.remove(done);
        signup = {companyName: 'companyName',
            admin: {
                name: 'admin name',
                email: 'admin@email.com',
                password: 'password'
            }};
    });

    describe('POST /api/signups', function () {
        it('should return 200 with json result', function (done) {
            request(app)
                .post('/api/signups')
                .send(signup)
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('PUT /api/signups/:id', function () {
        it('should create company and user', function (done) {
            Signup.create(signup, function (err, signup) {
                request(app)
                    .put('/api/signups/' + signup._id)
                    .expect(200)
                    .end(done)
            });
        });
    });
});


