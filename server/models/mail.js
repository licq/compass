var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamps');

var nameAndAddressSchema = mongoose.Schema({
    address: String,
    name: String
});

var mailSchema = mongoose.Schema({
    from: {
        type: [nameAndAddressSchema ],
        required: true
    },
    to: [nameAndAddressSchema ],
    cc: [ nameAndAddressSchema ],
    bcc: [ nameAndAddressSchema ],
    subject: String,
    html: String,
    text: String,
    date: Date,
    attachments: [
        {
            contentType: String,
            fileName: String,
            contentDisposition: String,
            contentId: String,
            transferEncoding: String,
            length: Number,
            generatedFileName: String,
            checksum: String,
            content: Buffer
        }
    ],
    email: {
        type: String,
        required: true,
        index: true
    }
});

mailSchema.plugin(timestamps);


mongoose.model('Mail', mailSchema);