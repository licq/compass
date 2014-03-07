var Registration = require('../models/registration');

module.exports = function (app) {
    app.get('/signup', function (req, res) {
        res.render('registrations/new');
    });

    app.post('/registrations', function (req, res) {
        var registration = new Registration(req.body);

        registration.save(function (err) {
            if (err) {
                console.log(err.errors);
                return res.render('registrations/new', {
                    errors: err.errors,
                    registration: registration
                });
            }
            res.send('激活邮件已经发送到' + registration.admin.email
                + ',请根据邮箱内容继续');
        });
    });
};

