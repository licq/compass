'use strict';

var app = require('../../../server'),
    request = require('supertest'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Company = mongoose.model('Company'),
    Factory = require('../factory');


describe('users', function () {
    var cookies;

    beforeEach(function (done) {
        User.remove().exec();
        Company.remove().exec();
        Factory('user', function (user) {
            Factory.build('mail', function (mail) {
                request(app).post('/api/sessions')
                    .send({email: user.email, password: user.password})
                    .expect(200)
                    .end(function (err, res) {
                        cookies = res.headers['set-cookie'].pop().split(';')[0];
                        done();
                    });
            });
        });
    });

    after(function (done) {
        User.remove().exec();
        Company.remove().exec();
        done();
    });

    describe('POST /api/users', function () {
        it('should return 200 with json result', function (done) {
            var req = request(app).post('/api/users');
            req.cookies = cookies;
            req.send({
                name: 'for test create',
                email: 'fortest@create.com',
                password: 'password',
                title: 'ceo'
            })
                .expect(200)
                .end(function (err) {
                    done(err);
                });
        });
    });
});


