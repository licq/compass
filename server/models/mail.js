var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamps');

var mailSchema = mongoose.Schema({
    from: {
        type: [{address: String, name: String}],
        required: true
    },
    to: [{address: String, name:String}],
    cc: [{address: String, name:String}],
    bcc: [{address: String, name:String}],
    subject: String,
    html: String,
    text: String,
    date: Date,
    attachments: [Buffer],
    email: {
        type: String,
        required: true
    }
});

mailSchema.plugin(timestamps);


mongoose.model('Mail', mailSchema);