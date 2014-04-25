'use strict';

var mongoose = require('mongoose'),
    Resume = mongoose.model('Resume'),
    _ = require('lodash'),
    jobs = require('../tasks/jobs');

exports.list = function (req, res, next) {
    var query = {
        query: {
            filtered: {
                filter: {
                    term: {
                        company: req.user.company.toString()
                    }
                }
            }
        }
    };

    if (req.query.q) {
        query.query.filtered.query = {
            match: {
                _all: {
                    query: req.query.q,
                    operator: 'and'
                }
            }
        }
    } else {
        query.query.filtered.query = {
            match_all: {}
        }
    }

    if (req.query.page && req.query.pageSize) {
        query.from = (req.query.page - 1) * req.query.pageSize;
        query.size = req.query.pageSize;
    }

    Resume.search(query, function (err, results) {
        if (err) return next(err);
        return res.header('totalCount', results.hits.total)
            .json(_.map(results.hits.hits, function (hit) {
                hit._source._id = hit._id;
                return hit._source;
            }));
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