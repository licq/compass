var expect = require('chai').expect,
  helper = require('../testHelper'),
  ApplicationSetting = require('mongoose').model('ApplicationSetting'),
  Factory = require('../factory');

describe('applicationSettings', function () {
  var request,
    user;

  beforeEach(function (done) {
    helper.clearCollections('Company', 'User', 'ApplicationSetting', function () {
      helper.login(function (agent, newUser) {
        request = agent;
        user = newUser;
        done();
      });
    });
  });

  describe('applicationSetting exist', function () {
    var applicationSetting;
    beforeEach(function (done) {
      Factory.create('applicationSetting', {company: user.company}, function (newApplicationSetting) {
        applicationSetting = newApplicationSetting;
        done();
      });
    });
    describe('get /api/applicationSetting', function () {
      it('should return the applicationSetting of the company', function (done) {
        request.get('/api/applicationSettings')
          .expect(200)
          .expect('content-type', /json/)
          .end(function (err, res) {
            expect(res.body.positionRightControlled).to.be.false;
            done(err);
          });
      });
    });

    describe('post /api/applicationSettings', function () {
      it('should update the existed applicationSetting', function (done) {
        request.post('/api/applicationSettings')
          .send({
            positionRightControlled: true
          })
          .expect(200, function () {
            ApplicationSetting.findById(applicationSetting._id, function (err, found) {
              expect(found.positionRightControlled).to.be.true;
              done(err);
            });
          });
      });
    });
  });
  describe('applicationSetting not exist', function () {
    describe('get /api/applicationSettings', function () {
      it('should return 200', function (done) {
        request.get('/api/applicationSettings')
          .expect(200)
          .expect('content-type', /json/, done);
      });
    });

    describe('post /api/applicationSettings', function () {
      it('should create new applicationSetting', function (done) {
        request.post('/api/applicationSettings')
          .send({
            positionRightControlled: true
          })
          .expect(200, function () {
            ApplicationSetting.findOne({company: user.company}, function (err, found) {
              expect(found.positionRightControlled).to.be.true;
              done();
            });
          });
      });
    });
  });
});
