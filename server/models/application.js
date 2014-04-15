var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamps');

var applicationSchema = mongoose.Schema({
    name: String,
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    resume: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resume'
    },
    applyPosition: String,
    birthday: Date,
    degree: String,
    gender: String,
    status: {
        type: String,
        default: 'new',
        enum: ['new', 'passed', 'pursued', 'undetermined']
    }
});

mongoose.model('Application', applicationSchema);