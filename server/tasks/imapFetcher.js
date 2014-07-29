'use strict';

var Imap = require('imap'),
  inspect = require('util').inspect,
  _ = require('lodash'),
  MailParser = require('mailparser').MailParser,
  mongoose = require('mongoose'),
  Mail = mongoose.model('Mail'),
  logger = require('../config/winston').logger();

function saveToDB(mail, address, callback) {
  mail.mailbox = address;
  Mail.create(mail, function (err, created) {
    require('./jobs').addParseResumeJob(created, function () {
      callback(err);
    });
  });
}

function parse(mailData, callback) {
  var mailParser = new MailParser({
    debug: false,
    defaultCharset: 'gbk',
    streamAttachments: true,
    showAttachmentLinks: true
  });
  mailParser.write(mailData);
  mailParser.end();

  mailParser.on('end', function (mail) {
    callback(mail);
  });
}

exports.fetch = function fetch(mailbox, callback) {
  var email = mailbox.toObject();
  email.user = email.address;
  email.host = email.server;

  var imap = new Imap(email);
  var newRetrievedMails = [], allMails = [];
  imap.connect();
  imap.once('ready', function () {
    imap.openBox('INBOX', function (err, box) {
      if (err) imap.end();

      imap.search(['ALL'], function (err, uids) {
        if (err) imap.end();

        if (uids.length > 0) {
          allMails = _.map(uids, function (uid) {
            return uid.toString();
          });
          var retrievedMails = mailbox.retrievedMails || [];
          var toBeRetrieved = _.difference(allMails, retrievedMails);

          var count = 1;
          if (toBeRetrieved.length > 0) {
            var fetcher = imap.fetch(toBeRetrieved, { bodies: '' });

            fetcher.on('message', function (msg, seqno) {

              msg.on('body', function (stream, info) {
                var buffer = '';

                stream.on('data', function (chunk) {
                  buffer += chunk;
                });

                stream.once('end', function () {
                  count++;
                  parse(buffer, function (mail) {
                    saveToDB(mail, mailbox.address, function (err) {
                      if (err) {
                        logger.error('save resume to db failed because of', err);
                        imap.end();
                      }
                    });
                  });
                });
              });

              msg.once('attributes', function (attrs) {
                newRetrievedMails.push(attrs.uid);
              });

              msg.once('end', function () {
              });
            });

            fetcher.once('error', function (err) {
              logger.error('IMAP Mails Fetch error: ' + err);
            });

            fetcher.once('end', function () {

              if (!mailbox.keepMails && /deleted/i.test(box.permFlags.join(''))) {
                imap.addFlags(allMails, 'DELETED', function (err) {
                  if (err)
                    logger.error('Email Not Deleted', err);
                  else {
                    logger.error('Email Deleted');

                    mailbox.retrievedMails = [];
                  }
                });
              } else if (mailbox.keepMails) {
                mailbox.retrievedMails = _.union(mailbox.retrievedMails, newRetrievedMails);
              }

              imap.end();
            });
          } else {
            imap.end();
          }
        } else {
          imap.end();
        }
      });
    });
  });

  imap.once('error', function (err) {
    logger.error(err);
  });

  imap.once('end', function () {
    mailbox.save(function () {
      if (mailbox.retrievedMails.length === 0) {
        callback(null, allMails.length, allMails.length);
      } else
        callback(null, newRetrievedMails.length, allMails.length);
    });
  });
};