var async = require('async');

exports.clearCollections = function () {
  var models = Array.prototype.slice.call(arguments, 0);
  var done = models.pop();
  async.eachSeries(models, function (model, callback) {
    model.remove({}, callback);
  }, done);
};