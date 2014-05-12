"use strict";

var mongoose = require('mongoose'),
  timestamps = require('mongoose-timestamps');


var defaultItems = [
  {
    name: '专业知识', rate: 1
  },
  {
    name: '工作能力', rate: 1
  },
  {
    name: '工作态度', rate: 1
  },
  {
    name: '主动性', rate: 1
  },
  {
    name: '学习能力', rate: 1
  },
  {
    name: '团队合作', rate: 1
  }
];

var evaluationCriterionSchema = mongoose.Schema({
  items: [
    {
      name: {
        type: String,
        required: [true, '请输入评价']
      },
      rate: {
        type: Number,
        default: 1
      }
    }
  ],

  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  }
});

evaluationCriterionSchema.statics.findOrCreate = function (companyId, done) {
  var self = this;
  this.findOne({company: companyId}, function (err, criterion) {
    if (err) {
      return done(err);
    }
    if (criterion) {
      return done(null, criterion);
    }
    self.create({company: companyId, items: defaultItems }, done);
  });
};

evaluationCriterionSchema.plugin(timestamps);

mongoose.model('EvaluationCriterion', evaluationCriterionSchema);