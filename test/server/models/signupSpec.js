'use strict';

var mongoose = require('mongoose'),
    Signup = mongoose.model('Signup'),
    Company = mongoose.model('Company'),
    User = mongoose.model('User'),
    should = require('should');

var signup;

describe('Signup', function () {

    before(function (done) {
        Company.create({name: 'already exist'}, function (err, company) {
            User.create({name: 'user', email: 'already@exist.com', password: 'password', company: company._id});
            done();
        });
    });
    describe('#validate', function () {
        it('should show errors if with empty arguments', function (done) {
            new Signup().save(function (err) {
                should.exist(err);
                err.errors['companyName'].type.should.equal('required');
                err.errors['admin.name'].type.should.equal('required');
                err.errors['admin.password'].type.should.equal('required');
                err.errors['admin.email'].type.should.equal('required');

                done();
            });
        });

        it('should show errors if with invalid email', function (done) {
            new Signup({'admin.email': 'invalid email'}).save(function (err) {
                err.errors['admin.email'].type.should.equal('user defined');
                err.errors['admin.email'].message.should.equal('Email格式错误');
                done();
            });
        });

        it('should show error if the company already existed', function (done) {
            new Signup({companyName: 'already exist'}).save(function (err) {
                should.exist(err);
                console.log(err);
                err.errors.companyName.message.should.equal('该公司已注册');
                done();
            });
        });

        it('should show error if the user already existed', function (done) {
            new Signup({'admin.email': 'already@exist.com'}).save(function (err) {
                should.exist(err);
                console.log(err);
                err.errors['admin.email'].message.should.equal('该邮箱已注册');
                done();
            });
        });
    });

    describe('#create', function (done) {
        it('should create new signup', function (done) {
            var signup = new Signup({companyName: 'newName',
                'admin.name': 'newName',
                'admin.email': 'new@email.com',
                'admin.password': 'password'});
            signup.save(done);
        });
    });

    after(function (done) {
        User.remove().exec();
        Company.remove().exec();
        done();
    });
});
