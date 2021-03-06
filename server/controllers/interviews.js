'use strict';

var mongoose = require('mongoose'),
  _ = require('lodash'),
  Interview = mongoose.model('Interview'),
  Resume = mongoose.model('Resume');

exports.list = function (req, res, next) {
  req.user.hasPositions(req.query.applyPosition, function (err, positions) {
    if (err) return next(err);
    req.query.applyPosition = positions;
    if (req.query.status === 'offer accepted') {
      Interview.queryOfferAccepted(req.user.company, req.query, function (err, interviews) {
        if (err) return next(err);
        res.json(interviews);
      });
    }
    else if (req.query.status === 'offered') {
      Interview.queryOffered(req.user.company, req.query, function (err, interviews) {
        if (err) return next(err);
        res.json(interviews);
      });
    } else {
      Interview.queryNew(req.user.company, req.query, function (err, interviews) {
        if (err) return next(err);
        if (req.query.pageSize) {
          Interview.countNew(req.user.company, req.query, function (err, count) {
            res.header('totalCount', count).json(interviews);
          });
        } else {
          res.json(interviews);
        }
      });
    }
  });
};

exports.get = function (req, res, next) {
  var query = Interview.findOne({_id: req.params.id, company: req.user.company})
    .populate('events.interviewers', 'name')
    .populate('reviews.interviewer', 'name');

  query.exec(function (err, interview) {
    if (err) return next(err);
    if (!interview) return res.json(404, {message: 'not found'});
    res.json(interview);
  });
};

exports.applyPositions = function (req, res, next) {
  if (req.query.for === 'company') {
    Interview.applyPositionsForCompany(req.user.company, function (err, allPositions) {
      req.user.hasPositions(allPositions, function (err, positions) {
        if (err) return next(err);
        res.json(positions);
      });
    });
  } else {
    Interview.applyPositionsForUser(req.user, function (err, positions) {
      if (err) return next(err);
      res.json(positions);
    });
  }
};

exports.update = function (req, res, next) {
  Interview.findOne({_id: req.params.id, company: req.user.company})
    .exec(function (err, interview) {
      if (err) return next(err);
      if (!interview) return res.json(404, {message: 'not found'});
      if (req.body.status) {
        interview.status = req.body.status;
        interview.statusBy = req.user;
        interview.applierRejectReason = req.body.applierRejectReason;
        interview.onboardDate = req.body.onboardDate;
        if (interview.status === 'recruited')
          interview.onboardDate = new Date();
        if(interview.onboardDate)
          interview.onboardDate.setHours(12, 0, 0, 0);
        interview.save(function (err) {
          if (err) return next(err);
          Resume.findById(interview.application, function (err, resume) {
            if (err) return next(err);
            if (!resume) return res.send(200);
            resume.status = interview.status;
            resume.saveAndIndex(function (err) {
              if (err) return next(err);
              res.send(200);
            });
          });
        });
      } else if (req.body.applyPosition) {
        interview.applyPosition = req.body.applyPosition;
        interview.save(function (err) {
          if (err) return next(err);
          res.send(200);
        });
      }
    });
};
