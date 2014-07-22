var mongoose = require('mongoose');

var applierRejectReasonSchema = mongoose.Schema({
  reason:
  {type: String,
    unique: true}
});

mongoose.model('ApplierRejectReason', applierRejectReasonSchema);