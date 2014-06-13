var expect = require('chai').expect,
  helper = require('../testHelper'),
  Factory = require('../factory'),
  EventSetting = require('mongoose').model('EventSetting');

describe('eventSettings', function () {
  var request,
    user;

  beforeEach(function (done) {
    helper.clearCollections('Company', 'User','Role', 'EventSetting', function () {
      helper.login(function (agent, newUser) {
        request = agent;
        user = newUser;
        done();
      });
    });
  });

  describe('eventSetting exist', function () {
    var eventSetting;
    beforeEach(function (done) {
      Factory.create('eventSetting', {company: user.company}, function (newEventSetting) {
        eventSetting = newEventSetting;
        done();
      });
    });
    describe('get /api/eventSetting', function () {
      it('should return the eventSetting of the company', function (done) {
        request.get('/api/eventSettings')
          .expect(200)
          .expect('content-type', /json/)
          .end(function (err, res) {
            expect(res.body.duration).to.equal(90);
            done(err);
          });
      });
    });

    describe('post /api/eventSettings', function () {
      it('should update the existed eventSetting', function (done) {
        request.post('/api/eventSettings')
          .send({
            duration: 60
          })
          .expect(200, function () {
            EventSetting.findById(eventSetting._id, function (err, found) {
              expect(found.duration).to.equal(60);
              done(err);
            });
          });
      });
    });
  });
  describe('eventSetting not exist', function () {
    describe('get /api/eventSettings', function () {
      it('should return 200', function (done) {
        request.get('/api/eventSettings')
          .expect(200)
          .expect('content-type', /json/, done);
      });
    });

    describe('post /api/eventSettings', function () {
      it('should create new eventSetting', function (done) {
        request.post('/api/eventSettings')
          .send({
            duration: 45
          })
          .expect(200, function () {
            EventSetting.findOne({company: user.company}, function (err, eventSetting) {
              expect(eventSetting.duration).to.equal(45);
              expect(eventSetting.createdBy.toString()).to.equal(user.id);
              done();
            });
          });
      });
    });
  });
});