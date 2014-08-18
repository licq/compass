'use strict';

var Imap = require('imap'),
  inspect = require('util').inspect,
  _ = require('lodash'),
  mailParser = require('./mailParser'),
  mongoose = require('mongoose'),
  Mail = mongoose.model('Mail'),
  logger = require('../config/winston').logger();

exports.fetch = function fetch(mailbox, callback) {
  var email = mailbox.toObject();
  email.user = email.account;
  email.host = email.server;
  //email.debug = console.log;

  var imap = new Imap(email);
  var allMails = [], toBeRetrieved;
  var retrievedCount = 0;
  var retrievedMails = mailbox.retrievedMails || [];
  imap.connect();
  imap.once('ready', function () {
    imap.openBox('INBOX', function (err, box) {
      if (err) imap.end();

      imap.search(['ALL'], function (err, uids) {
        if (err) imap.end();

        allMails = _.map(uids, function (uid) {
          return uid.toString();
        });
        retrievedMails = _.intersection(allMails, retrievedMails);
        toBeRetrieved = _.difference(allMails, retrievedMails);

        if (toBeRetrieved.length > 0) {
          var fetcher = imap.fetch(toBeRetrieved, { bodies: '' });

          fetcher.on('message', function (msg, seqno) {

            msg.on('body', function (stream, info) {
              var buffer = '';

              stream.on('data', function (chunk) {
                buffer += chunk;
              });

              stream.once('end', function () {
                retrievedCount += 1;
                mailParser.parseAndSave(buffer, mailbox.address, function (err) {
                  if (err && err.code !== 11000 && err.code !== 11001) {
                    logger.error('save resume to db failed because of', err);
                  }
                });
              });
            });

            msg.once('attributes', function (attrs) {
              retrievedMails.push(attrs.uid);
            });

            msg.once('end', function () {
            });
          });

          fetcher.once('error', function (err) {
            logger.error('IMAP Mails Fetch error: ' + err);
            imap.end();
          });

          fetcher.once('end', function () {

            if (!mailbox.keepMails && /deleted/i.test(box.permFlags.join(''))) {
              imap.addFlags(allMails, 'DELETED', function (err) {
                if (err)
                  logger.error('Email Not Deleted', err);
                else {
                  logger.info('Email Deleted');
                }
                imap.end();
              });
            } else imap.end();
          });
        } else {
          imap.end();
        }
      });
    });
  });


  imap.once('error', function (err) {
    logger.error(err);
    callback(err, retrievedCount, retrievedMails);
  });

  imap.once('end', function () {
    callback(null, retrievedCount, retrievedMails);
  });
};