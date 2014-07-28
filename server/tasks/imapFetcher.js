var Imap = require('imap'),
  inspect = require('util').inspect,
  _ = require('lodash'),
  MailParser = require('mailparser').MailParser,
  mongoose = require('mongoose'),
  Mail = mongoose.model('Mail'),
  logger = require('../config/winston').logger();

var fs = require('fs'), fileStream;

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
  console.log('start fetching');
  var imap = new Imap(mailbox);
  console.log('---to connect');
  var newRetrievedMails = [], allMails = [];
  imap.connect();
  imap.once('ready', function () {
    console.log('ready');
    imap.openBox('INBOX', function (err, box) {
      if (err) imap.end();

      imap.search(['ALL'], function (err, uids) {
        if (err) imap.end();


        if (uids.length > 0) {
          console.log('uids', uids);
          allMails = _.map(uids, function (uid) {
            console.log(uid);
            return uid.toString();
          });
          console.log('all ', allMails);
          var correct = false,
            totalUnretrievedMails, totalToBeprocessedMails,
            totalMails = 0,
            toBeDeleted = [],
            toBeProcessed = [],
            deleted = [],
            retrievedMails = mailbox.retrievedMails || [],
            keepMails = mailbox.keepMails,
            current = 0, next = current + 1;
          console.log('retrieved mails', typeof allMails[0]);
          var toBeRetrieved = _.difference(allMails, retrievedMails);

          console.log('toberetrieved ', toBeRetrieved);

          var count = 1;
          if (toBeRetrieved.length > 0) {
            var fetcher = imap.fetch(toBeRetrieved, { bodies: '' });

            fetcher.on('message', function (msg, seqno) {
              // console.log('Message #%d', seqno);
              var prefix = '(#' + seqno + ') ';

              msg.on('body', function (stream, info) {
                // console.log(prefix + 'Body');
                var buffer = '';

                stream.on('data', function (chunk) {
                  buffer += chunk;
                });

                stream.once('end', function () {
                  parse(buffer, function (mail) {
                    console.log('processed ', count);
                    count++;
//                  saveToDB(mail, mailbox.user, function (err) {
//                    if (err) {
//                      logger.error('save resume to db failed because of', err);
//                    }
//                  fs.writeFile('msg-' + seqno + '-body.txt', JSON.stringify(mail), function (err) {
//                    if (err) {
//                      imap.end();
//                    }
//                    console.log("File saved!");
//                  });
                  });
                });
              });

              msg.once('attributes', function (attrs) {
                newRetrievedMails.push(attrs.uid);
                console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
              });

              msg.once('end', function () {
                console.log(prefix + 'Finished');
              });
            });

            fetcher.once('error', function (err) {
              console.log('Fetch error: ' + err);
            });

            fetcher.once('end', function () {
              console.log('Done fetching all messages!');

              if (!mailbox.keepMails && /deleted/i.test(box.permFlags.join(''))) {
                imap.addFlags(allMails, 'DELETED', function (err) {
                  console.log(allMails);
                  if (err)
                    console.log('Email Not Deleted', err);
                  else {
                    console.log('Email Deleted');

                    mailbox.retrievedMails = [];
                  }
                });
              } else if (mailbox.keepMails) {
                console.log('new retrieve', newRetrievedMails, mailbox.retrievedMails);
                mailbox.retrievedMails = _.union(mailbox.retrievedMails, newRetrievedMails);
                console.log('mailbox final ', mailbox);
              }

              imap.end();
            });
          } else {
            imap.end();
          }
        } else {
          imap.end()
        }
      });
    });
  });

  imap.once('error', function (err) {
    console.log(err);
  });

  imap.once('end', function () {
    console.log('Connection ended');
    mailbox.save(function () {
      console.log('end', newRetrievedMails.length, ' ', allMails.length);
      if (mailbox.retrievedMails.length === 0) {
        callback(null, allMails.length, allMails.length);
      }else
      callback(null, newRetrievedMails.length, allMails.length);
    });
    // mailbox.save();
  });
};