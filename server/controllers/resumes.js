'use strict';

var mongoose = require('mongoose'),
    Resume = mongoose.model('Resume'),
    _ = require('lodash'),
    jobs = require('../tasks/jobs');

exports.list = function (req, res, next) {
    var query = {
        query: {
            term: {
                company: req.user.company.toString()
            }
        }
    };
    if (req.query.q) {
        query.query.query_string = {
            query: req.query.q
        };
    }
//    query.sort = {created_at: {order: 'desc'}};
    if (req.query.page && req.query.pageSize) {
        query.from = (req.query.page - 1) * req.query.pageSize;
        query.size = req.query.pageSize;
    }

    query = {
        query: {
            filtered: {
                query: {
                    query_string:{
                        query: "'阿里巴巴'"
                    }
                },
                filter:{
                    term:{
                        company: req.user.company.toString()
                    }
                }
            }
        }
    };

    console.log(JSON.stringify(query));
    Resume.search(query, function (err, results) {
        if (err) return next(err);
        console.log(results);
        return res.header('totalCount', results.hits.total)
            .json(_.map(results.hits.hits, '_source'));
    });
};

exports.get = function (req, res) {
    res.json(req.resume);
};

exports.load = function (req, res, next, id) {
    Resume.findOne({_id: id, company: req.user.company})
        .exec(function (err, resume) {
            if (err) return next(err);
            if (!resume) return res.send(404, {message: 'not found'});
            req.resume = resume;
            next();
        });
};