'use strict';

module.exports = function(app) {

    app.get('/', function(req,res){
        res.render('index', {
            user: req.user ? JSON.stringify(req.user) : 'null'
        });
    });
    app.get('/home',function(req,res){
        res.render('home',{
            user: req.user? JSON.stringify(req.user) : 'null'
        });
    });

};
