var POPClient = require('poplib'),
    _ = require('lodash'),
    MailParser = require('mailparser').MailParser,
    mongoose = require('mongoose'),
    Mail = mongoose.model('Mail'),
    logger = require('../config/winston').logger();


exports.fetch = function (mailbox, callback) {
    var correct = false;
    var totalMails, current = 1;

    var client = new POPClient(mailbox.port, mailbox.server, {
        tlserrs: true,
        enabletls: mailbox.ssl,
        debug: false
    });

    client.on("error", function (err) {
        if (err.errno === 111) logger.log("Unable to connect to server, failed");
        else logger.log("Server error occurred, failed");
        callback('connect failed');
    });

    client.on("connect", function () {
        client.login(mailbox.account, mailbox.password);
    });

    client.on("invalid-state", function (cmd) {
        logger.log("Invalid state. You tried calling " + cmd);
    });

    client.on("locked", function (cmd) {
        logger.log("Current command has not finished yet. You tried calling " + cmd);
    });

    client.on("login", function (status, data) {
        if (status) {
            correct = true;
            client.list();
        } else {
            logger.log("LOGIN/PASS failed");
            client.quit();
        }
    });

    client.on("list", function (status, msgcount, msgnumber, data, rawdata) {
        if (status === false) {
            logger.log("LIST failed");
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
                        logger.log(err);
                        client.rset();
                    } else client.dele(msgnumber);
                });
            });
        } else {
            logger.log("RETR failed for msgnumber " + msgnumber);
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
            logger.log("DELE failed for msgnumber " + msgnumber);
            client.rset();
        }
    });

    client.on("rset", function (status, rawdata) {
        client.quit();
    });

    client.on("quit", function (status, rawdata) {
//        if (status === true) logger.log("QUIT success");
//        else logger.log("QUIT failed");
        if (correct) {
            callback(null, current - 1);
        } else {
            callback('login failed', 0);
        }
    });
};


function saveToDB(mail, address, callback) {
    mail.mailbox = address;
    Mail.create(mail, function (err) {
        callback(err);
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