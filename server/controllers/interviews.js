'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash'),
    Interview = mongoose.model('Interview');

exports.list = function (req, res, next) {
    if (req.query.status === 'unprocessed') {
        Interview.unprocessedFor(req.user, function (err, interviews) {
            if (err) return next(err);
            res.json(interviews);
        });
    }
};

exports.get = function (req, res, next) {
    Interview.findOne({_id: req.params.id, company: req.user.company})
        .populate('events.interviewers', 'name')
        .populate('reviews.interviewer', 'name')
        .exec(function (err, interview) {
            if (err) return next(err);
            if (!interview) return res.json(404, {message: 'not found'});
            res.json(interview);
        });
};

exports.update = function (req, res, next) {

    Interview.findOne({_id: req.params.id, company: req.user.company})
        .exec(function (err, interview) {
            if (err) return next(err);

            if (req.body.review) {
                var review = req.body.review,
                    notFoundExistReview = true;

                _.forEach(interview.reviews, function (rev, index) {
                    if (rev.interviewer.toString() === review.interviewer.toString) {
                        interview.reviews[index].comment = review.comment;
                        interview.reviews[index].score = review.score;
                        interview.reviews[index].qualified = review.qualified;
                        interview.reviews[index].interviewer = review.interviewer;
                        notFoundExistReview = false;
                        return false;
                    }
                });

                if (notFoundExistReview) {
                    interview.reviews.push(review);
                }
            }

            if (req.body.reviewToDelete) {
                var reviewToDelete;
                console.log(req.body.reviewToDelete);
                _.forEach(interview.reviews, function (rev) {
                    if (rev.interviewer.toString() === req.body.reviewToDelete) {
                        console.log('found');
                        reviewToDelete = rev;
                        return false;
                    }
                });
                console.log(interview.reviews);
                console.log(reviewToDelete);
                if (reviewToDelete) {
                    reviewToDelete.remove();
                }
            }

            interview.save(function (err) {
                if (err) return next(err);
                res.send(200);
            });
        });
};