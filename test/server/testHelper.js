var async = require('async'),
  mongoose = require('mongoose'),
  request = require('supertest'),
  Position = mongoose.model('Position'),
  app = require('../../server'),
  Factory = require('./factory'),
  _ = require('lodash');

exports.clearCollections = function () {
  var models = Array.prototype.slice.call(arguments, 0);
  var done = models.pop();
  async.eachSeries(models, function (model, callback) {
    if (typeof model === 'string') {
      model = mongoose.model(model);
    }
    model.remove({}, callback);
  }, done);
};


function authenticateAgent(user, cb) {
  var agent = request.agent(app);
  agent.post('/publicApi/sessions')
    .send({email: user.email, password: user.password})
    .expect(200, function () {
      cb(agent, user);
    });
}

exports.login = function (user, cb) {
  if (!cb && typeof user === 'function') {
    cb = user;
    Factory.create('company', function (company) {
      Factory.create('role', {company: company._id}, function (role) {
        Factory.create('user', {company: company._id, role: role._id}, function (user) {
          authenticateAgent(user, cb);
        });
      });
    });
  } else {
    authenticateAgent(user, cb);
  }
};
exports.createPosition = function (options, cb) {
  var owners, fields = {};
  if (!cb && typeof options === 'function') {
    cb = options;
  } else {
    _.merge(fields, options);
  }

  if (options.owners) {
    owners = _.map(options.owners, '_id');
    fields.owners = owners;
  }
  if (options.toCreateUser) {
    Factory.build('position', fields, function (p) {
      Factory.create('user', {positions: [p._id], company: p.company}, function (user) {
        p.owners = fields.owners || [];
        p.owners.push(user._id);
        Position.create(p, function (err, position) {
          cb(err, position, user);
        });
      });
    });
  } else {
    Factory.build('position', fields, function (p) {
      Position.createPosition(p, function (err, position) {
        cb(err, position);
      });
    });
  }
};

