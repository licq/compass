var Imap = require('imap'),
  logger = require('../config/winston').logger();

exports.check = function (mailbox, callback) {
  var imap = new Imap(mailbox);
  var correct = false;
  imap.connect();
  imap.once('ready', function () {
    console.log('ready');
    correct = true;
    console.log('state', imap.state);
    imap.end();
  });

  imap.once('error', function (err) {
    console.log(err);
    console.log('state', imap.state);
    if (imap.state === 'connected' || (err.source && err.source === 'authentication')) {
      callback('login failed');
    } else if (imap.state === 'disconnected' || (err.source && err.source === 'socket') || err.code === 'ENOTFOUND') {
      callback('connect failed')
    }
  });

  imap.once('end', function () {
    console.log('Connection ended');
    if (correct) {
      callback(null);
    } else callback('login failed');
  });
};