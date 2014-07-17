var async = require('async'),
  mongoose = require('mongoose'),
  request = require('supertest'),
  app = require('../../server'),
  Factory = require('./factory'),
  Position = mongoose.model('Position'),
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
  if (!cb && typeof options === 'function') {
    cb = options;
  }
  var owners, position, userFields = {};
  if (options.owners) {
    userFields = {company: options.owners[0].company};
    owners = _.map(options.owners, '_id');
  } else if (options.company) {
    userFields = {company: options.company};
  }
  Factory.create('user', userFields, function (createdUser) {
    var user = createdUser;
    if (!options.owners)
      owners = [user._id];
    var positionFields = {company: user.company, owners: owners};
    if (options.name)
      positionFields.name = options.name;
    Factory.build('position', positionFields, function (p) {
      Position.createPosition(p, function (err, ps) {
        position = ps;
        cb(err, position, user);
      });
    });
  });
};

