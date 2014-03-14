'use strict';

module.exports = function (app) {

    app.get('/', function (req, res) {
        console.log(req.user);
        res.render('index', {
            bootstrappedUser: req.user
        });
    });

};
