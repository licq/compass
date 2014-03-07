'use strict';

var should = require('should'),
    mongoose = require('mongoose'),
    Registration = mongoose.model('Registration');

var registration;

describe('Registration', function () {
    describe('Create', function () {
        it('should have four errors if without arguments', function (done) {
            registration = new Registration();
            registration.save(function (err) {
                Object.keys(err.errors).should.have.length(4);

                done();
            });
        });
    });
});