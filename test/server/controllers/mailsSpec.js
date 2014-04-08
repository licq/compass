'use strict';

var app = require('../../../server'),
    request = require('supertest'),
    expect = require('chai').expect,
    Factory = require('../factory'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Company = mongoose.model('Company');


describe('/api/mails', function () {
    var cookies, mailId;

    before(function (done) {
        Company.remove().exec();
        User.remove().exec();

        Factory.create('user', function (user) {
            Factory.build('mail', function (mail) {
                mailId = mail._id;
                mail.company = user.company;
                mail.save(function () {
                    request(app).post('/api/sessions')
                        .send({email: user.email, password: user.password})
                        .expect(200)
                        .end(function (err, res) {
                            console.log(res.headers['set-cookie']);
                            cookies = res.headers['set-cookie'].pop().split(';')[0];
                            done();
                        });
                });
            });
        });
    });

    describe('GET /api/mails', function () {
        it('should return 200 with json result', function (done) {
            var req = request(app).get('/api/mails?page=1&pageSize=5');
            req.cookies = cookies;

            req.expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    expect(err).to.not.exist;
                    expect(res.get('totalCount')).to.equal('1');
                    expect(res.body).to.have.length(1);
                    done();
                });
        });
    });

    describe('GET /api/mails/:mailId', function () {
        it('should return 200 with json result', function (done) {
            var req = request(app).get('/api/mails/' + mailId);
            req.cookies = cookies;

            req.expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    expect(err).to.not.exist;
                    expect(mailId.equals(res.body._id)).to.be.true;
                    done();
                });
        });
    });
});


