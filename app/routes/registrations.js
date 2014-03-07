var Registration = require('../models/registration');

module.exports = function (app) {
    app.get('/signup', function (req, res) {
        res.render('registrations/new', {
            errors: req.flash.errors,
            registration: req.flash.registration
        });
    });

    app.post('/registrations', function (req, res) {
        var registration = new Registration(req.body);

        registration.save(function (err) {
            if (err) {
                req.flash.registration = registration;
                req.flash.errors = err.errors;
                return res.redirect('/signup');
            }
            req.flash.email = registration.admin.email;
            res.redirect('/registrations/success');
        });
    });

    app.get('/registrations/success', function (req, res) {
        res.render('registrations/success', {
            email: req.flash.email
        });
    });
};

