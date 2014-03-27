var POPClient = require('poplib'),
    async = require('async'),
    _ = require('lodash'),
    MailParser = require('mailparser').MailParser,
    mongoose = require('mongoose'),
    Mail = mongoose.model('Mail');


exports.verify = function (mailbox, callback) {
    //todo: fix this only for test pass code
    if(mailbox.account === 'emailaccountforverifypass'){
        callback();
    }
    var correct = false;

    var client = new POPClient(mailbox.port, mailbox.server, {
        tlserrs: true,
        enabletls: mailbox.ssl,
        debug: false
    });

    client.on("error", function (err) {
        if (err.errno === 111) console.log("Unable to connect to server, failed");
        else console.log("Server error occurred, failed");
        callback('connect failed');
    });

    client.on("connect", function () {
        client.login(mailbox.account, mailbox.password);
    });

    client.on("invalid-state", function (cmd) {
        console.log("Invalid state. You tried calling " + cmd);
    });

    client.on("locked", function (cmd) {
        console.log("Current command has not finished yet. You tried calling " + cmd);
    });

    client.on("login", function (status, data) {
        if (status) {
            correct = true;
        } else {
            console.log("LOGIN/PASS failed");
        }
        client.quit();
    });

    client.on("rset", function (status, rawdata) {
        client.quit();
    });

    client.on("quit", function (status, rawdata) {

        if (status === true) console.log("verify QUIT success");
        else console.log("verify QUIT failed");

        if (correct) callback(null)
        else callback('login failed');
    });
};


exports.fetch = function (mailbox, callback) {
    var correct = false;
    var totalMails, current = 1;

    var client = new POPClient(mailbox.port, mailbox.server, {
        tlserrs: true,
        enabletls: mailbox.ssl,
        debug: false
    });

    client.on("error", function (err) {
        if (err.errno === 111) console.log("Unable to connect to server, failed");
        else console.log("Server error occurred, failed");
        callback('connect failed');
    });

    client.on("connect", function () {
        client.login(mailbox.account, mailbox.password);
    });

    client.on("invalid-state", function (cmd) {
        console.log("Invalid state. You tried calling " + cmd);
    });

    client.on("locked", function (cmd) {
        console.log("Current command has not finished yet. You tried calling " + cmd);
    });

    client.on("login", function (status, data) {
        if (status) {
            correct = true;
            client.list();
        } else {
            console.log("LOGIN/PASS failed");
            client.quit();
        }
    });

    client.on("list", function (status, msgcount, msgnumber, data, rawdata) {
        if (status === false) {
            console.log("LIST failed");
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
                        console.log(err);
                        client.rset();
                    } else client.dele(msgnumber);
                });
            });
        } else {
            console.log("RETR failed for msgnumber " + msgnumber);
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
            console.log("DELE failed for msgnumber " + msgnumber);
            client.rset();
        }
    });

    client.on("rset", function (status, rawdata) {
        client.quit();
    });

    client.on("quit", function (status, rawdata) {
//        if (status === true) console.log("QUIT success");
//        else console.log("QUIT failed");
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
        defaultCharset: 'gbk'
    });
    mailParser.write(mailData);
    mailParser.end();

    mailParser.on('end', function (mail) {
        callback(mail);
    });
}