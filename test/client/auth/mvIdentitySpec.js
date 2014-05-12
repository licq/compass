describe('mvIdentity', function () {

  describe('with no user object in window', function () {
    beforeEach(module(function ($provide) {
      $provide.value('$window', {});
    }));
    beforeEach(module('compass'));

    describe('#currentUser', function () {
      it('should return currentUser undefined', inject(function (mvIdentity) {
        expect(mvIdentity.currentUser).to.not.exist;
      }));
    });

    describe('#isAuthenticated', function () {
      it('should return false', inject(function (mvIdentity) {
        expect(mvIdentity.isAuthenticated()).to.be.false;
      }));
    });
  });

  describe('with user object in window', function () {
    beforeEach(module(function ($provide) {
      $provide.value('$window', {
        bootstrappedUserObject: 'user'
      });
    }));
    beforeEach(module('compass'));

    describe('#currentUser', function () {
      it('should return currentUser undefined', inject(function (mvIdentity) {
        expect(mvIdentity.currentUser).to.equal('user');
      }));
    });

    describe('#isAuthenticated', function () {
      it('should return false', inject(function (mvIdentity) {
        expect(mvIdentity.isAuthenticated()).to.be.true;
      }));
    });
  });
});