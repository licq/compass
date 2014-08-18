'use strict';

var POPClient = require('poplib'),
  _ = require('lodash'),
  MailParser = require('mailparser').MailParser,
  mongoose = require('mongoose'),
  Mail = mongoose.model('Mail'),
  logger = require('../config/winston').logger();

function saveToDB(mail, address, callback) {
  logger.info('saveToDB', address);
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
    streamAttachments: true,
    showAttachmentLinks: true
  });
  mailParser.write(mailData);
  mailParser.end();

  mailParser.on('end', function (mail) {
    if (mail.subject.indexOf('导出简历') > -1 && mail.attachments.length > 0 &&
      mail.attachments[0].fileName.indexOf('.mht') > -1 &&
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

exports.fetch = function (mailbox, callback) {
  logger.info('fetch', mailbox.address);
  var loginCorrect = false,
    deleteIndex = 1,
    retrievedMails = mailbox.retrievedMails || [],
    toBeRetrieved = [],
    retrievedCount = 0,
    uidsOnServer;

  var client = new POPClient(mailbox.port, mailbox.server, {
    ignoretlserrs: true,
    enabletls: mailbox.ssl,
    debug: true
  });

  client.on('error', function (err) {
    logger.info('error', mailbox.address);
    if (err.errno === 111) logger.info('Unable to connect to server, failed');
    else logger.info('Server error occurred, failed');
    logger.error('error info', err);
    callback('connect failed', 0);
  });

  client.on('connect', function () {
    logger.info('connect', mailbox.address);
    client.login(mailbox.account, mailbox.password);
  });

  client.on('invalid-state', function (cmd) {
    logger.info('Invalid state. You tried calling ' + cmd);
  });

  client.on('locked', function (cmd) {
    logger.info('Current command has not finished yet. You tried calling ' + cmd);
  });

  client.on('login', function (status, data) {
    logger.info('login', mailbox.address);
    if (status) {
      loginCorrect = true;
      client.uidl();
    } else {
      logger.info('LOGIN/PASS failed');
      callback('用户名/密码不正确', 0);
    }
  });

  client.on('uidl', function (status, msgnumber, data, rawdata) {
    logger.info('uidl', mailbox.address);
    if (status === false) {
      logger.info('LIST failed');
      client.quit();
    } else {
      logger.info('uidl1');
      uidsOnServer = _.compact(data);
      retrievedMails = _.intersection(uidsOnServer, retrievedMails);
      _.forEach(_.difference(uidsOnServer, retrievedMails), function (item) {
          var index = _.indexOf(uidsOnServer, item);
          toBeRetrieved.push({msgnum: index + 1, uid: uidsOnServer[index]});
        }
      );
      logger.info('uidl5');
      if (toBeRetrieved.length > 0) {
        logger.info('uidl6');
        client.retr(toBeRetrieved[0].msgnum);
      } else if (!mailbox.keepMails && uidsOnServer.length > 0) {
        logger.info('uidl7');
        client.dele(deleteIndex);
      } else {
        logger.info('uidl8');
        client.quit();
      }
    }
  });

  client.on('retr', function (status, msgnumber, data, rawdata) {
    logger.info('retr', mailbox.address);
    if (status === true) {
      parse(data, function (mail) {
        saveToDB(mail, mailbox.address, function (err) {
          if (err && err.code !== 11000 && err.code !== 11001) {
            logger.error('save resume to db failed because of', err);
            client.quit();
          } else {
            retrievedMails.push(toBeRetrieved[0].uid);
            toBeRetrieved.shift();
            retrievedCount += 1;
            if (toBeRetrieved.length > 0) {
              client.retr(toBeRetrieved[0].msgnum);
            } else if (!mailbox.keepMails) {
              client.dele(deleteIndex);
            } else client.quit();
          }
        });
      });
    } else {
      logger.info('RETR failed for msgnumber ' + msgnumber);
      client.quit();
    }
  });

  client.on('dele', function (status, msgnumber, data, rawdata) {
    logger.info('dele', mailbox.address);
    if (status === true) {
      deleteIndex += 1;
      if (deleteIndex <= uidsOnServer.length) {
        client.dele(deleteIndex);
      } else {
        client.quit();
      }
    } else {
      logger.info('DELE failed for msgnumber ' + msgnumber);
      client.quit();
    }
  });

  client.on('rset', function (status, rawdata) {
    logger.info('rset', mailbox.address);
    client.quit();
  });

  client.on('quit', function (status, rawdata) {
    logger.info('quit', mailbox.address);
    if (loginCorrect) {
      callback(null, retrievedCount, retrievedMails);
    } else {
      callback('login failed', 0);
    }
  });
};


