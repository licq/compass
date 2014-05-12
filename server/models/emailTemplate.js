var mongoose = require('mongoose'),
  timestamps = require('mongoose-timestamps');

var emailTemplateSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, '名称不能为空'],
  },
  subject: {
    type: String,
    required: [true, '邮件标题不能为空'],
  },
  content: {
    type: String,
    required: [true, '内容不能为空']
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
});

emailTemplateSchema.index({name: 1, company: 1}, {unique: true});

emailTemplateSchema.plugin(timestamps);

mongoose.model('EmailTemplate', emailTemplateSchema);