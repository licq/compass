'use strict';

var Imap = require('imap'),
  logger = require('../config/winston').logger();

exports.check = function (mailbox, callback) {
 var email = mailbox.toObject();
  email.user = email.account;
  email.host = email.server;
  var imap = new Imap(email);
  var correct = false;
  imap.connect();
  imap.once('ready', function () {
    correct = true;
    imap.end();
  });

  imap.once('error', function (err) {
    logger.error(err);
    if (imap.state === 'connected' || (err.source && err.source === 'authentication')) {
      callback('login failed');
    } else if (imap.state === 'disconnected' || (err.source && err.source === 'socket') || err.code === 'ENOTFOUND') {
      callback('connect failed');
    }
  });

  imap.once('end', function () {
    if (correct) {
      callback(null);
    } else callback('login failed');
  });
};