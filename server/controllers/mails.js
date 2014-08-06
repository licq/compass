'use strict';

var mongoose = require('mongoose'),
  Mail = mongoose.model('Mail'),
  _ = require('lodash'),
  jobs = require('../tasks/jobs');

exports.list = function (req, res, next) {
  var query = Mail.find({company: req.user.company})
    .sort('-date')
    .select('fromName fromAddress subject date mailbox');
  if (req.query.page && req.query.pageSize) {
    query.skip((req.query.page - 1) * req.query.pageSize).limit(req.query.pageSize);
  }
  query.exec(function (err, mails) {
    if (err) return next(err);
    Mail.count({company: req.user.company}, function (err, totalCount) {
      if (err) return next(err);
      return res.header('totalCount', totalCount).json(mails);
    });
  });
};

exports.getHtml = function (req, res, next) {
  Mail.findOne({_id: req.params.id, company: req.user.company})
    .select('html')
    .exec(function (err, mail) {
      if (err) return next(err);
      if (!mail) return res.send(404, {message: req.params.id + 'not found'});
      res.send(mail.html);
    });
};


exports.parse = function (req, res, next) {
  Mail.findOne({_id: req.params.id, company: req.user.company})
    .select('html subject company fromAddress createdAt attachments')
    .exec(function (err, mail) {
      if (err) return next(err);
      if (!mail) return res.send(404, {message: req.params.id + 'not found'});
      jobs.addParseResumeJob(mail, function () {
        res.end();
      });
    });
};

exports.get = function (req, res, next) {
  Mail.findOne({_id: req.params.id, company: req.user.company})
    .select('subject date fromAddress fromName')
    .exec(function (err, mail) {
      if (err) return next(err);
      if (!mail) return res.send(404, {message: req.params.id + 'not found'});

      res.json(mail);
    });
};
