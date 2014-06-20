var Factory = require('../factory'),
  expect = require('chai').expect,
  helper = require('../testHelper');

describe('emails', function () {
  var request, company;

  beforeEach(function (done) {
    helper.clearCollections('Email', 'User', 'Role', 'Company', function () {
      helper.login(function (agent) {
        request = agent;
        Factory.create('email', function () {
          done();
        });
      });
    });
  });
  describe('get /sysAdminApi/emailCount', function () {
    it('should return 1', function (done) {
      helper.clearCollections('Company', 'User', 'Role', function () {
        Factory.create('company', function (createdCompany) {
          Factory.create('role',
            {
              company: createdCompany,
              name: '系统管理员',
              permissions: ['#systemSettings']
            }, function (createdRole) {
              Factory.create('user', {company: createdCompany, role: createdRole}, function (user) {
                helper.login(user, function (agent) {
                  company = createdCompany;
                  request = agent;
                  request.get('/sysAdminApi/emailCount')
                    .expect(200)
                    .end(function (err, res) {
                      expect(err).to.not.exist;
                      expect(res.body.emailCount).to.equal(1);
                      done();
                    });
                });
              });
            });
        });
      });
    });
  });
});