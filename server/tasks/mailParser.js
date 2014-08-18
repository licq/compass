var MailParser = require('mailparser').MailParser,
  logger = require('../config/winston').logger(),
  Mail = require('mongoose').model('Mail');

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

exports.parseAndSave = function (mailData, address, callback) {
  parse(mailData, function (mail) {
    saveToDB(mail, address, callback);
  });
};
