var mongoose = require('mongoose');

var tokenSchema = new mongoose.Schema({
    _id: {type: String},
    userId: {type: String, unique: true}
});

tokenSchema.statics.cousume = function (id, cb) {
    this.findByIdAndRemove(id, cb);
};
tokenSchema.statics.save = function (userId, cb) {
    var id = randomString(64);
    var token = new this({
        _id: id,
        userId: userId
    });
    token.save(function (err) {
        cb(err, id);
    });
};

function randomString(len) {
    var buf = []
        , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        , charlen = chars.length;

    for (var i = 0; i < len; ++i) {
        buf.push(chars[getRandomInt(0, charlen - 1)]);
    }

    return buf.join('');
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


module.exports = mongoose.model('Token', tokenSchema);

