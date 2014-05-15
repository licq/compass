var mongoose = require('mongoose'),
  timestamps = require('mongoose-timestamps');

var eventSettingSchema = mongoose.Schema({
  duration: {
    type: Number,
    required: [true, '默认时长不能为空']
  },
  newToApplier: {
    type: Boolean,
    default: false
  },
  newTemplateToApplier: {
    type: String
  },
  editToApplier: {
    type: Boolean,
    default: false
  },
  editTemplateToApplier: {
    type: String
  },
  deleteToApplier: {
    type: Boolean,
    default: false
  },
  deleteTemplateToApplier: {
    type: String
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    unique: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
});

eventSettingSchema.plugin(timestamps);

mongoose.model('EventSetting', eventSettingSchema);