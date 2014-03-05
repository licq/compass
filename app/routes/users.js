'use strict';


module.exports = function (app, passport) {

    app.get('/signin', function(req, res) {
        res.render('users/signin', {
            title: 'Signin',
            message: req.flash('error')
        });
    });
    app.get('/signup', function(req, res) {
        res.render('users/signup', {
            title: 'Sign up',
            user: new User()
        });
    });
    app.get('/signout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    app.get('/users/me', function(req, res) {
        res.jsonp(req.user || null);
    });

    // Setting up the users api
    app.post('/users', function(req, res, next) {
        var user = new User(req.body);
        var message = null;

        user.provider = 'local';
        user.save(function(err) {
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
            req.logIn(user, function(err) {
                if (err) return next(err);
                return res.redirect('/');
            });
        });
    });

    // Setting up the userId param
    app.param('userId', function(req, res, next, id) {
        User
            .findOne({
                _id: id
            })
            .exec(function(err, user) {
                if (err) return next(err);
                if (!user) return next(new Error('Failed to load User ' + id));
                req.profile = user;
                next();
            });
    });
    // Setting the local strategy route
    app.post('/users/session',
        passport.authenticate('local', {
            failureRedirect: '/signin',
            successRedirect: '/home',
            failureFlash: true
        }));
};
