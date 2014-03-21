var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamps');

var mailSchema = mongoose.Schema({
    from: {
        type: String,
        required: true
    },
    to: [String],
    cc: [String],
    bcc: [String],
    subject: String,
    html: String,
    text: String,
    date: Date,
    attachements: [Buffer],
    email: {
        type: String,
        required: true
    }
});

mailSchema.plugin(timestamps);


mongoose.model('Mail', mailSchema);