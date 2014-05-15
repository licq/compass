'use strict';

var POPClient = require('poplib'),
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

exports.fetch = function (mailbox, callback) {
  var correct = false;
  var totalMails, current = 1;

  var client = new POPClient(mailbox.port, mailbox.server, {
    tlserrs: true,
    enabletls: mailbox.ssl,
    debug: false
  });

  client.on("error", function (err) {
    if (err.errno === 111) logger.info("Unable to connect to server, failed");
    else logger.info("Server error occurred, failed");
    callback('connect failed');
  });

  client.on("connect", function () {
    client.login(mailbox.account, mailbox.password);
  });

  client.on("invalid-state", function (cmd) {
    logger.info("Invalid state. You tried calling " + cmd);
  });

  client.on("locked", function (cmd) {
    logger.info("Current command has not finished yet. You tried calling " + cmd);
  });

  client.on("login", function (status, data) {
    if (status) {
      correct = true;
      client.list();
    } else {
      logger.info("LOGIN/PASS failed");
      client.quit();
    }
  });

  client.on("list", function (status, msgcount, msgnumber, data, rawdata) {
    if (status === false) {
      logger.info("LIST failed");
      client.quit();
    } else if (msgcount > 0) {
      totalMails = msgcount;
      client.retr(current);
    } else {
      client.quit();
    }
  });

  client.on("retr", function (status, msgnumber, data, rawdata) {
    if (status === true) {
      current += 1;

      parse(data, function (mail) {
        saveToDB(mail, mailbox.address, function (err) {
          if (err) {
            logger.error('save resume to db failed because of', err);
            client.rset();
          } else client.dele(msgnumber);
        });
      });
    } else {
      logger.info("RETR failed for msgnumber " + msgnumber);
      client.rset();
    }
  });

  client.on("dele", function (status, msgnumber, data, rawdata) {
    if (status === true) {
      if (current > totalMails)
        client.quit();
      else
        client.retr(current);
    } else {
      logger.info("DELE failed for msgnumber " + msgnumber);
      client.rset();
    }
  });

  client.on("rset", function (status, rawdata) {
    client.quit();
  });

  client.on("quit", function (status, rawdata) {
//        if (status === true) logger.info("QUIT success");
//        else logger.info("QUIT failed");
    if (correct) {
      callback(null, current - 1);
    } else {
      callback('login failed', 0);
    }
  });
};


