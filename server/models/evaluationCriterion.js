var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamps');

var evaluationCriterionSchema = mongoose.Schema({
    criterions: [
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

evaluationCriterionSchema.plugin(timestamps);

mongoose.model('EvaluationCriterion', evaluationCriterionSchema);