var mongoose = require('mongoose');

var tokenSchema = new mongoose.Schema({
    userId: {type: String}
});

tokenSchema.statics.consume = function (id, cb) {
    this.findByIdAndRemove(id, cb);
};
tokenSchema.statics.save = function (userId, cb) {
    var token = new this({
        userId: userId
    });
    token.save(function (err, saved) {
        if (err) return cb(err);
        cb(null, saved.id);
    });
};

module.exports = mongoose.model('Token', tokenSchema);

