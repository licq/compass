'use strict';

var mongoose = require('mongoose'),
    Registration = mongoose.model('Registration'),
    _ = require('lodash');

var registration;

describe('Registration', function () {
    describe('Create', function () {
        it('should have four errors if without arguments', function (done) {
            registration = new Registration();
            registration.save(function (err) {
                console.log(_.map(err.errors, function (e) {
                    return e.message;
                }));
                Object.keys(err.errors).should.have.length(4);

                done();
            });
        });
    });
});