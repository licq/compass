'use strict';

var POPClient = require('poplib'),
  _ = require('lodash'),
  MailParser = require('mailparser').MailParser,
  mongoose = require('mongoose'),
  Mail = mongoose.model('Mail'),
  logger = require('../config/winston').logger();

function saveToDB(mail, address, callback) {
  logger.info('saveToDB',address);
  mail.mailbox = address;
  Mail.create(mail, function (err, created) {
    require('./jobs').addParseResumeJob(created, function () {
      callback(err);
    });
  });
}

function parse(mailData, callback) {
  logger.info('parse');
  var mailParser = new MailParser({
    debug: false,
    defaultCharset: 'gbk',
    streamAttachments: false,
    showAttachmentLinks: true
  });
  mailParser.write(mailData);
  mailParser.end();

  mailParser.on('end', function (mail) {
    if (mail.subject.indexOf('导出简历') > 0 && mail.attachments.length > 0 && mail.attachments[0].fileName.indexOf('.mht') > 0) {
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

exports.fetch = function (mailbox, callback) {
  logger.info('fetch',mailbox.address);
  var correct = false, resetted = false,
    totalUnretrievedMails, totalToBeprocessedMails,
    totalMails = 0,
    toBeRetrieved = [],
    toBeDeleted = [],
    toBeProcessed = [],
    deleted = [],
    retrievedMails = mailbox.retrievedMails || [],
    keepMails = mailbox.keepMails,
    current = 0, next = current + 1,
    msgnumbers = [], uids = [], newRetrievedMails = [];

  var client = new POPClient(mailbox.port, mailbox.server, {
    tlserrs: true,
    enabletls: mailbox.ssl,
    debug: false
  });

  client.on('error', function (err) {
    logger.info('error',mailbox.address);
    if (err.errno === 111) logger.info('Unable to connect to server, failed');
    else logger.info('Server error occurred, failed');
    callback('connect failed');
  });

  client.on('connect', function () {
    logger.info('connect',mailbox.address);
    client.login(mailbox.account, mailbox.password);
  });

  client.on('invalid-state', function (cmd) {
    logger.info('Invalid state. You tried calling ' + cmd);
  });

  client.on('locked', function (cmd) {
    logger.info('Current command has not finished yet. You tried calling ' + cmd);
  });

  client.on('login', function (status, data) {
    logger.info('login',mailbox.address);
    if (status) {
      correct = true;
      client.uidl();
    } else {
      logger.info('LOGIN/PASS failed');
      callback('用户名/密码不正确');
    }
  });

  client.on('uidl', function (status, msgnumber, data, rawdata) {
    logger.info('uidl',mailbox.address);
    if (status === false) {
      logger.info('LIST failed');
      client.quit();
    } else if (data.length > 0) {
      _.forEach(rawdata.split('\r\n'), function (item) {
        if (item.length) {
          var items = item.split(' ');
          msgnumbers.push(parseInt(items[0]));
          uids.push(items[1]);
        }
      });

      totalMails = uids.length;
      _.forEach(_.difference(uids, retrievedMails), function (item) {
          var index = _.indexOf(uids, item);
          if (index !== -1) {
            toBeRetrieved.push({msgnum: msgnumbers[index], uid: uids[index]});
          }
        }
      );

      if (!keepMails) {
        _.forEach(retrievedMails, function (item) {
            var index = _.indexOf(uids, item);
            if (index !== -1) {
              toBeDeleted.push({msgnum: msgnumbers[index], uid: uids[index]});
            }
          }
        );
      }

      toBeProcessed = toBeRetrieved.concat(toBeDeleted);
      totalUnretrievedMails = toBeRetrieved.length;
      totalToBeprocessedMails = toBeProcessed.length;
      current = next;
      next += 1;

      if (totalUnretrievedMails > 0) {
        client.retr(toBeProcessed[current - 1].msgnum);
      } else if (totalToBeprocessedMails > 0) {
        client.dele(toBeProcessed[current - 1].msgnum);
      } else {
        client.quit();
      }

    } else {
      current = next;
      client.quit();
    }
  });

//  client.on("list", function (status, msgcount, msgnumber, data, rawdata) {
//    if (status === false) {
//      logger.info("LIST failed");
//      client.quit();
//    } else if (msgcount > 0) {
//      totalMails = msgcount;
//      client.retr(current);
//    } else {
//      client.quit();
//    }
//  });

  client.on('retr', function (status, msgnumber, data, rawdata) {
    logger.info('retr',mailbox.address);
    if (status === true) {
      parse(data, function (mail) {
        saveToDB(mail, mailbox.address, function (err) {
          if (err) {
            logger.error('save resume to db failed because of', err);
            client.rset();
          }
          else if (keepMails) {
            newRetrievedMails.push(toBeProcessed[current - 1].uid);
            current = next;
            next += 1;
            if (current <= totalUnretrievedMails) {
              client.retr(toBeProcessed[current - 1].msgnum);
            } else if (current > totalUnretrievedMails && current <= totalToBeprocessedMails) {
              client.dele(toBeProcessed[current - 1].msgnum);
            } else client.quit();
          }
          else {
            client.dele(msgnumber);
          }
        });
      });
    } else {
      logger.info('RETR failed for msgnumber ' + msgnumber);
      client.rset();
    }
  });

  client.on('dele', function (status, msgnumber, data, rawdata) {
    logger.info('dele',mailbox.address);
    if (status === true) {
      current = next;
      next += 1;
      if (current <= totalUnretrievedMails) {
        client.retr(toBeProcessed[current - 1].msgnum);
      } else if (current > totalUnretrievedMails && current <= totalToBeprocessedMails) {
        deleted.push(toBeProcessed[current - 2].uid);
        client.dele(toBeProcessed[current - 1].msgnum);
      } else {
        deleted.push(toBeProcessed[current - 2].uid);
        client.quit();
      }
    } else {
      logger.info('DELE failed for msgnumber ' + msgnumber);
      client.rset();
    }
  });

  client.on('rset', function (status, rawdata) {
    logger.info('rset',mailbox.address);
    resetted = true;
    client.quit();
  });

  client.on('quit', function (status, rawdata) {
//        if (status === true) logger.info("QUIT success");
//        else logger.info("QUIT failed");
    logger.info('quit',mailbox.address);
    retrievedMails = retrievedMails || [];
    if (keepMails)
      retrievedMails = _.union(retrievedMails, newRetrievedMails);
    else if (!resetted) {
      retrievedMails = _.difference(retrievedMails, deleted);
    }
    //mailbox.save(function () {
    if (correct) {
      callback(null, current - 1, totalMails, retrievedMails);
    } else {
      callback('login failed', 0, totalMails, retrievedMails);
    }
    //});
  });
};


