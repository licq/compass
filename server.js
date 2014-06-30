'use strict';

var express = require('express');

var app = express();

var config = require('./server/config/config');

require('./server/config/winston').init(config);

require('./server/config/mongoose')(config);

require('./server/config/express')(app, config);

require('./server/config/passport')();

require('./server/config/systemAdmin').init();

require('./server/tasks/mailer').init(config);

var workers = require('./server/tasks/workers');

workers.start();

app.listen(config.port);
console.log('Compass Listening on port ' + config.port + '...');

process.once('SIGTERM', function () {
  workers.stop();
});

module.exports = app;
