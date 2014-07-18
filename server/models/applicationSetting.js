'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  timestamps = require('mongoose-timestamp'),
  validator = require('validator');

var applicationSettingSchema = new Schema({
  positionRightControlled: {
    type: Boolean,
    default: false
  },
  filterSamePerson: {
    type: Number,
    default: 0
  },
  rejectLetterToApplier: {
    type: Boolean,
    default: false
  },
  rejectLetterToApplierTemplate:{
    type: String,
    default: '<h4><span>尊敬的{{姓名}}，　<br/></span><span>    您好，感谢您对本公司{{应聘职位}}的关注。非常抱歉公司目前没有合适您的岗位。我们已经将您的简历放入我司的人才库，期待有机会合作。<br>谢谢!<br>'
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    unique: true
  }
});

applicationSettingSchema.plugin(timestamps);

mongoose.model('ApplicationSetting', applicationSettingSchema);