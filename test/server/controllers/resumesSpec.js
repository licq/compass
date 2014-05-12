var
  Resume = require('mongoose').model('Resume'),
  helper = require('../testHelper'),
  Factory = require('../factory'),
  expect = require('chai').expect;

describe('#resumes', function () {
  var request;

  beforeEach(function (done) {
    helper.clearCollections('User', 'Company', 'Resume', function () {
      Resume.clearAll(true, function () {
        helper.login(function (agent, user) {
          request = agent;
          Factory.build('resume', {company: user.company}, function (resume) {
            resume.saveAndIndexSync(done);
          });
        });
      });
    });
  });

  it('should return all resumes', function (done) {
    request.get('/api/resumes')
      .expect(200)
      .expect('content-type', /json/)
      .end(function (err, res) {
        expect(res.body.hits.total).to.equal(1);
        expect(res.body.facets.applyPosition.terms).to.have.length(1);
        expect(res.body.facets.applyPosition.terms[0].term).to.equal('cio');
        expect(res.body.facets.applyPosition.terms[0].count).to.equal(1);
        expect(res.body.facets.highestDegree.terms).to.have.length(1);
        expect(res.body.facets.highestDegree.terms[0].term).to.equal('master');
        expect(res.body.facets.highestDegree.terms[0].count).to.equal(1);
        expect(res.body.facets.age.entries).to.have.length(1);
        expect(res.body.facets.age.entries[0].key).to.equal(0);
        expect(res.body.facets.age.entries[0].count).to.equal(1);
        done(err);
      });
  });
});