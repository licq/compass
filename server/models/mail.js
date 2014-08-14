'use strict';

var mongoose = require('mongoose'),
  Email = mongoose.model('Email'),
  timestamps = require('mongoose-timestamp');

var nameAndAddressSchema = mongoose.Schema({
  address: String,
  name: String
});

var mailSchema = mongoose.Schema({
  from: {
    type: [nameAndAddressSchema ],
    required: true
  },
  fromName: String,
  fromAddress: String,
  to: [nameAndAddressSchema ],
  cc: [ nameAndAddressSchema ],
  bcc: [ nameAndAddressSchema ],
  subject: String,
  html: String,
  text: String,
  date: {
    type: Date
  },
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
  mailbox: {
    type: String,
    required: true,
    index: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    index: true
  },
  parseErrors: [String]
});

mailSchema.index({subject: 1, date: -1}, {unique: true});

mailSchema.pre('save', function (next) {
  var self = this;

  Email.findOne({address: this.mailbox}, function (err, email) {
    if (err || !email) return next();
    self.company = email.company;
    next();
  });
});

mailSchema.pre('save', function (next) {
  if (this.from && this.from[0]) {
    this.fromName = this.from[0].name;
    this.fromAddress = this.from[0].address;
  }
  next();
});


mailSchema.plugin(timestamps);


mongoose.model('Mail', mailSchema);