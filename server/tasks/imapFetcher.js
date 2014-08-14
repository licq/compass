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
    if (mail.subject.indexOf('导出简历') > 0 && mail.attachments.length > 0 &&
      mail.attachments[0].fileName.indexOf('.mht') > 0 &&
      mail.attachments[0].content) {
      var b = new Buffer(mail.attachments[0].content, 'base64');
      var newMailParser = new MailParser();
      newMailParser.write(b);
      newMailParser.end();
      newMailParser.on('end', function (o) {
        mail.html = o.html;
        callback(mail);
      });
    } else
      callback(mail);
  });
}

exports.fetch = function fetch(mailbox, callback) {
  var email = mailbox.toObject();
  email.user = email.account;
  email.host = email.server;

  var imap = new Imap(email);
  var newRetrievedMails = [], allMails = [];
  var retrievedMails = mailbox.retrievedMails || [];
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
                    logger.info('Email Deleted');

                    retrievedMails = [];
                  }
                });
              } else if (mailbox.keepMails) {
                retrievedMails = _.union(retrievedMails, newRetrievedMails);
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
    callback(err, newRetrievedMails.length, allMails.length, retrievedMails);
  });

  imap.once('end', function () {
    // mailbox.save(function () {
    if (retrievedMails.length === 0) {
      callback(null, allMails.length, allMails.length, retrievedMails);
    } else
      callback(null, newRetrievedMails.length, allMails.length, retrievedMails);
    //});
  });
};