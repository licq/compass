'use strict';

var express = require('express');

var app = express();

var config = require('./server/config/config');

require('./server/config/winston').init(config);

require('./server/tasks/jobs').init(config);

require('./server/config/mongoose')(config);

require('./server/config/express')(app, config);

require('./server/config/passport')();

require('./server/config/initDB').init();

require('./server/tasks/mailer').init(config);

var workers = require('./server/tasks/workers');

var jobs = workers.start(config);

process.on('SIGINT', function () {
  console.log('server is shutting down');
  jobs.shutdown(function (err) {
    console.log('Kue is shut down.', err || '');
    process.exit(0);
  }, 5000);
});

app.listen(config.port, function () {
  console.log('Compass Listening on port ' + config.port + '...');
});

module.exports = app;
