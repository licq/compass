'use strict';

exports.render = function(req, res) {
    console.log('index called');
    res.render('index', {
        user: req.user ? JSON.stringify(req.user) : 'null'
    });
};

exports.home = function(req,res){
    res.render('home',{
        user: req.user? JSON.stringify(req.user) : 'null'
    });
};
