var POPClient = require('poplib'),
    async = require('async'),
    _ = require('lodash'),
    MailParser = require('mailparser').MailParser;

function Fetcher(options) {
    this.options = options;
}

Fetcher.prototype.connect = function (callback) {
    console.log('connect');

    this.client = new POPClient(this.options.port, this.options.server, {
        debug: true,
        enabletls: this.options.ssl
    });

    this.client.on('error', function (err) {
        console.log('connect error ', err);
        callback('connect failed');
    });

    this.client.on('connect', function () {
        console.log('connected');
        callback(null);
    });
};

Fetcher.prototype.login = function (callback) {

    this.client.login(this.options.account, this.options.password);
    this.client.on('login', function (status, rawdata) {
        if (status) {
            console.log('login success');
            callback(null);
        } else {
            callback('login failed');
        }
    });
};


Fetcher.prototype.list = function (callback) {
    this.client.list();
    this.client.on('list', function (status, msgcount, msgnumber, data, rawdata) {
        if (status) {
            console.log('list success');
            callback(null, msgcount);
        } else {
            console.log('list failed ', rawdata);
            callback('list failed');
        }
    });
};

Fetcher.prototype.retrieve = function (number, callback) {
    this.client.retr(number);
    this.client.on('retr', function (status, msgnumber, data, rawdata) {
        if (status) {
            console.log('retr success ' + number);
            callback(null, {
                msgNumber: msgnumber,
                mailData: data
            });
        } else {
            callback('retr failed');
        }
    });
};

Fetcher.prototype.dele = function (msgNumber, callback) {
    this.client.dele(msgNumber);
    this.client.on('dele', function (status, msgnumber, data, rawdata) {
        if (status) {
            console.log('dele successfully');
            callback(null);
        } else {
            console.log('dele ' + msgNumber + ' failed');
            console.log(rawdata);
            callback('dele ' + msgnumber + ' failed');
        }
    });
};

Fetcher.prototype.save = function (mailObject, callback) {
    console.log('save mail to mongo');
    callback(null, mailObject.msgNumber);
};


Fetcher.prototype.quit = function (callback, err) {
    this.client.quit();
    this.client.on('quit', function () {
        if (err) {
            console.log('quit ' + err);
            callback(err);
        } else
            callback();
    });
};

Fetcher.prototype.parse = function (mailObject, callback) {
    var mailParser = new MailParser({
        debug: true,
        defaultCharset: 'gbk'
    });
    mailParser.write(mailObject.mailData);
    mailParser.end();

    mailParser.on('end', function (mail) {
        console.log(mail);
        console.log(mail.headers);
        console.log(mail.subject);
        console.log(mail.from);
        callback(null, {
            msgNumber: mailObject.msgNumber,
            mail: mail
        });
    });
};

Fetcher.prototype.verify = function (callback) {
    var self = this;
    async.waterfall([
        self.connect.bind(self),
        self.login.bind(self)
    ], self.quit.bind(self, callback));
};

Fetcher.prototype.processOneMail = function (msgNumber, callback) {
    console.log('prcess ' + msgNumber);
    var self = this;
    async.waterfall([
        self.retrieve.bind(self, msgNumber),
        self.parse.bind(self),
        self.save.bind(self),
        self.dele.bind(self)
    ], callback);
};

Fetcher.prototype.all = function (callback) {
    var self = this;
    async.waterfall([
        this.connect.bind(this),
        this.login.bind(this),
        this.list.bind(this),
        function (msgCount, cb) {
            var arr = _.range(1, msgCount + 1);
            async.eachSeries(arr, self.processOneMail.bind(self), cb);
        }
    ], this.quit.bind(this, callback));
};

module.exports = Fetcher;