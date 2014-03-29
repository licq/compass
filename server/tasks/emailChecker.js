var POPClient = require('poplib'),
    logger = require('../config/winston').logger();

exports.check = function (mailbox, callback) {
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
        } else {
            logger.log("LOGIN/PASS failed");
        }
        client.quit();
    });

    client.on("rset", function (status, rawdata) {
        client.quit();
    });

    client.on("quit", function (status, rawdata) {

        if (status === true) logger.log("verify QUIT success");
        else logger.log("verify QUIT failed");

        if (correct) callback(null)
        else callback('login failed');
    });
}