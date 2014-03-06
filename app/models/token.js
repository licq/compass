var mongoose = require('mongoose'),
    ObjectId = mongoose.ObjectId;

var tokenSchema = new mongoose.Schema({
    userId: {type: String, unique: true}
});

tokenSchema.statics.consume = function (id, cb) {
    this.findByIdAndRemove(id, cb);
};
tokenSchema.statics.save = function (userId, cb) {
    var token = new this({
        userId: userId
    });
    token.save(function (err, saved) {
        cb(err, saved.id);
    });
};

module.exports = mongoose.model('Token', tokenSchema);

