'use strict';

var mongoose = require('mongoose'),
    Signup = mongoose.model('Signup'),
    _ = require('lodash');

var signup;

describe('Signup', function () {
    describe('Create', function () {
        it('should have four errors if without arguments', function (done) {
            signup = new Signup();
            signup.save(function (err) {
                console.log(_.map(err.errors, function (e) {
                    return e.message;
                }));
                Object.keys(err.errors).should.have.length(4);

                done();
            });
        });
    });
});