var mongoose = require('mongoose'),
    Application = mongoose.model('Application');

exports.list = function (req, res, next) {
    var query = Application.where({company: req.user.company}).sort('-applyDate');
    var count = Application.where({company: req.user.company});
    if (req.query.page && req.query.pageSize) {
        query.skip((req.query.page - 1) * req.query.pageSize).limit(req.query.pageSize);
    }
    if (req.query.status) {
        query.where({status: req.query.status});
        count.where({status: req.query.status});
    }
    query.exec(function (err, applications) {
        if (err) return next(err);
        count.count().exec(function (err, totalCount) {
            if (err) return next(err);
            return res.header('totalCount', totalCount).json(applications);
        });
    });
};
