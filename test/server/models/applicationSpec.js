var mongoose = require('mongoose'),
    Application = mongoose.model('Application'),
    expect = require('chai').expect,
    ObjectId = mongoose.Schema.Types.ObjectId,
    Factory = require('../factory');

describe('Application', function () {
    describe('create', function () {
        it('should create successfully', function () {
            var applicationData = {
                company: ObjectId('1'),
                resume: ObjectId('2'),
                applyPosition: 'cio',
                applyDate: new Date(),
                name: 'zhangsan',
                birthday: new Date(1980, 12, 8),
                gender: 'male'
            };

            Application.create(applicationData, function (err, application) {
                expect(err).to.not.exist;
                expect(application.company).to.exist;
                expect(application.resume).to.exist;
                expect(application.applyPosition).to.exist;
                expect(application.applyDate).to.exist;
                expect(application.name).to.exist;
                expect(application.birthday).to.exist;
                expect(application.gender).to.exist;
            });
        });
    });
});