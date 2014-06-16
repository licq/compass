var async = require('async'),
  mongoose = require('mongoose'),
  request = require('supertest'),
  app = require('../../server'),
  Factory = require('./factory');

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

exports.login = function login(user, cb) {
  if (!cb && typeof user === 'function') {
    cb = user;
    Factory.create('company', function(company){
      Factory.create('role', {company: company._id}, function(role){
        Factory.create('user', {company:company._id, role: role._id},function (user) {
          authenticateAgent(user, cb);
        });
      });
    });
  } else {
    authenticateAgent(user, cb);
  }
};