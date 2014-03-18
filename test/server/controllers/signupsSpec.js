'use strict';

var app = require('../../../server'),
    request = require('supertest'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Company = mongoose.model('Company'),
    Signup = mongoose.model('Signup'),
    Factory = require('../factory');


describe('singups', function () {
    beforeEach(function (done) {
        Signup.remove().exec();
        done();
    });

    after(function (done) {
        User.remove().exec();
        Company.remove().exec();
        Signup.remove().exec();
        done();
    });

    describe('POST /api/signups', function () {
        it('should return 200 with json result', function (done) {
            Factory.build('signup', function (signup) {
                request(app)
                    .post('/api/signups')
                    .send(signup)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(function (err) {
                        if (err) return done(err);
                        done();
                    });
            });
        });
    });

    describe('PUT /api/signups/:id', function () {
        it('should create company and user', function (done) {
            Factory('signup', function (signup) {
                request(app)
                    .put('/api/signups/' + signup._id)
                    .expect(200)
                    .end(done)
            });
        });
    });


});


