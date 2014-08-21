'use strict';

var POPClient = require('poplib'),
  _ = require('lodash'),
  mailParser = require('./mailParser'),
  mongoose = require('mongoose'),
  Mail = mongoose.model('Mail'),
  logger = require('../config/winston').logger();


exports.fetch = function (mailbox, callback) {
  logger.info('fetch', mailbox.address);
  var deleteIndex = 1,
    retrievedMails = mailbox.retrievedMails || [],
    toBeRetrieved = [],
    retrievedCount = 0,
    uidsOnServer,
    errorOccurred;

  var client = new POPClient(mailbox.port, mailbox.server, {
    ignoretlserrs: true,
    enabletls: mailbox.ssl,
    debug: false
  });

  client.on('error', function (err) {
    logger.info('error', mailbox.address);
    if (err && err.errno === 111) logger.error('Unable to connect to server, failed');
    else logger.error('Server error occurred, failed:', err);
    errorOccurred = 'connect failed';
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
      client.uidl();
    } else {
      logger.info('LOGIN/PASS failed');
      errorOccurred = '用户名/密码不正确';
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
        logger.info('uidl9');
      }
    }
  });

  client.on('retr', function (status, msgnumber, data, rawdata) {
    logger.info('retr', mailbox.address);
    if (status === true) {
      mailParser.parseAndSave(data, mailbox.address, function (err) {
        if (err && err.code !== 11000 && err.code !== 11001) {
          logger.error('save mail to db failed because of', err);
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
  });

  client.on('close', function () {
    logger.info('close', mailbox.address);
    if (errorOccurred) {
      callback(errorOccurred, 0);
    } else {
      callback(null, retrievedCount, retrievedMails);
    }
  });

  client.on('end', function () {
    logger.info('end', mailbox.address);
  });
};


