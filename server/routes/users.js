'use strict';


var mongoose = require('mongoose'),
    User = mongoose.model('User');

module.exports = function (app) {

    app.get('/users/me', function (req, res) {
        res.jsonp(req.user || null);
    });

    // Setting up the users api
    app.post('/users', function (req, res, next) {
        var user = new User(req.body);
        var message = null;

        user.provider = 'local';
        user.save(function (err) {
            if (err) {
                switch (err.code) {
                    case 11000:
                    case 11001:
                        message = '用户已存在';
                        break;
                    default:
                        message = '请输入所有的选项';
                }

                return res.render('users/signup', {
                    message: message,
                    user: user
                });
            }
            req.logIn(user, function (err) {
                if (err) return next(err);
                return res.redirect('/');
            });
        });
    });

    // Setting up the userId param
    app.param('userId', function (req, res, next, id) {
        User
            .findOne({
                _id: id
            })
            .exec(function (err, user) {
                if (err) return next(err);
                if (!user) return next(new Error('Failed to load User ' + id));
                req.profile = user;
                next();
            });
    });

};
