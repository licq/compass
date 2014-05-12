describe('mvSignupNewCtrl', function () {
  var $httpBackend,
    $scope,
    mvSignupNewCtrl;

  describe('#create', function () {
    beforeEach(module('compass'));
    beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
      $httpBackend = _$httpBackend_;
      $scope = $rootScope.$new();
      mvSignupNewCtrl = $controller('mvSignupNewCtrl', {
        $scope: $scope
      });
    }));

    it('should go to success page when create success', inject(function ($location) {
      var signupData = {companyName: 'company',
        adminEmail: 'aa@aa.com', adminName: 'aa',
        adminPassword: 'password'};
      $httpBackend.expectPOST('/api/signups', signupData)
        .respond({_id: '7788'});
      var spy = sinon.spy($location, 'path');

      _.merge($scope, signupData);

      $scope.create();

      $httpBackend.flush();
      expect(spy).to.have.been.calledWith('/signup/success/7788/aa@aa.com');
    }));
  });
});