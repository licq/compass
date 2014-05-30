var mongoose = require('mongoose');

var applierRejectReasonSchema = mongoose.Schema({
  reason: String
});

mongoose.model('ApplierRejectReason', applierRejectReasonSchema);