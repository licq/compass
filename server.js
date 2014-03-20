'use strict';

var express = require('express');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();

var config = require('./server/config/config')[env];

require('./server/config/mongoose')(config);

require('./server/config/express')(app, config);

require('./server/config/passport')();

require('./server/config/routes')(app);

require('./server/config/mailer').init(config);

require('./server/config/taskRunner').init();

app.listen(config.port);
console.log('Compass Listening on port ' + config.port + '...');

module.exports = app;
