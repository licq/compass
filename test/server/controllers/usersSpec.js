'use strict';

var app = require('../../../server'),
    request = require('supertest'),
    mongoose = require('mongoose'),
    expect = require('chai').expect,
    User = mongoose.model('User'),
    Company = mongoose.model('Company'),
    Factory = require('../factory');


describe('users', function () {
    var cookies;
    var existUser;

    beforeEach(function (done) {
        User.remove().exec();
        Company.remove().exec();
        Factory.create('user', function (user) {
            existUser = user;
            request(app).post('/api/sessions')
                .send({email: user.email, password: user.password})
                .expect(200)
                .end(function (err, res) {
                    cookies = res.headers['set-cookie'].pop().split(';')[0];
                    done();
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
            }).expect(200)
                .end(function (err) {
                    done(err);
                });
        });
    });

    describe('GET /api/users', function () {
        it('should return 200 with json result', function (done) {
            var req = request(app).get('/api/users');
            req.cookies = cookies;
            req.expect(200)
                .expect('content-type', /json/)
                .end(function (err, res) {
                    expect(res.body).to.have.length(1);
                    done(err);
                });
        });
    });

    describe('GET /api/users/:id', function () {
        it('should return 200 with json result', function (done) {
            var req = request(app).get('/api/users/' + existUser._id);
            req.cookies = cookies;
            req.expect(200)
                .expect('content-type', /json/)
                .end(function (err, res) {
                    expect(err).to.not.exist;
                    expect(res.body.name).to.equal(existUser.name);
                    done();
                });
        });
    });

    describe('DELETE /api/users/:id', function () {
        it('should return 200', function (done) {
            var req = request(app).del('/api/users/' + existUser._id);
            req.cookies = cookies;
            req.expect(200)
                .end(function (err) {
                    expect(err).to.not.exist;
                    done();
                });
        });
    });
});


