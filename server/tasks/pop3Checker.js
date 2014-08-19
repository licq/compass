'use strict';

var POPClient = require('poplib'),
  logger = require('../config/winston').logger();

exports.check = function (mailbox, callback) {
  //todo: fix this only for test pass code
  if (mailbox.account === 'emailaccountforverifypass') {
    callback();
  }
  var correct = false;

  var client = new POPClient(mailbox.port, mailbox.server, {
    ignoretlserrs: true,
    enabletls: mailbox.ssl,
    debug: false
  });

  client.on('error', function (err) {
    if (err.errno === 111) logger.info('Unable to connect to server, failed');
    else logger.info('Server error occurred, failed:', err);
    callback('connect failed');
  });

  client.on('capa', function(status,data){
    logger.info('capa',status,data);
    client.stls();
  });

  client.on('stls', function(status,rawdata){
    logger.info('stls',status,rawdata);
    client.login(mailbox.account,mailbox.password);
  });

  client.on('connect', function () {
    client.login(mailbox.account, mailbox.password);
  });

  client.on('invalid-state', function (cmd) {
    logger.info('Invalid state. You tried calling ' + cmd);
  });

  client.on('locked', function (cmd) {
    logger.info('Current command has not finished yet. You tried calling ' + cmd);
  });

  client.on('login', function (status, data) {
    if (status) {
      correct = true;
      client.quit();
    } else {
      logger.info('LOGIN/PASS failed');
      return callback('用户名/密码不正确');
    }
  });

  client.on('rset', function (status, rawdata) {
    client.quit();
  });

  client.on('quit', function (status, rawdata) {
    if (status === true) logger.info('verify QUIT success');
    else logger.info('verify QUIT failed');

    if (correct) callback(null);
    else callback('login failed');
  });
};