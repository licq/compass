describe('mvAuth', function () {
  beforeEach(module('compass'));

  describe('#login', function () {
    it('should set the correct user when session created', inject(function (mvAuth, $httpBackend, mvIdentity) {
      var userData = {email: 'email', password: 'password', remember_me: true};
      $httpBackend.expectPOST('/publicApi/sessions', userData)
        .respond({email: 'email'});
      mvAuth.login(userData);
      $httpBackend.flush();
      expect(mvIdentity.currentUser).to.exist;
    }));

    it('should not set user when session create failed', inject(function (mvAuth, $httpBackend, mvIdentity) {
      var userData = {email: 'email', password: 'password', remember_me: true};
      $httpBackend.expectPOST('/publicApi/sessions', userData)
        .respond(400);
      mvAuth.login(userData);
      $httpBackend.flush();
      expect(mvIdentity.currentUser).to.not.exist;
    }));
  });

  describe('#logout', function () {
    it('should clear the user when session deleted', inject(function (mvAuth, $httpBackend, mvIdentity) {
      $httpBackend.expectDELETE('/publicApi/sessions')
        .respond(200);
      mvAuth.logout();
      $httpBackend.flush();
      expect(mvIdentity.currentUser).to.not.exist;
    }));
  });
});