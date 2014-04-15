var mongoose = require('mongoose'),
    Application = mongoose.model('Application'),
    expect = require('chai').expect,
    ObjectId = mongoose.Schema.Types.ObjectId,
    Factory = require('../factory'),
    helper = require('../databaseHelper');

describe.skip('Application', function () {
    beforeEach(function(done){
        helper.clearCollections(Application,done);
    });

    describe('create', function () {
        it('should create successfully', function (done) {
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
                expect(application).to.have.property('company');
                expect(application).to.have.property('resume');
                expect(application).to.have.property('applyPosition');
                expect(application).to.have.property('applyDate');
                expect(application).to.have.property('name');
                expect(application).to.have.property('birthday');
                expect(application).to.have.property('gender');
                done();
            });
        });
    });
});