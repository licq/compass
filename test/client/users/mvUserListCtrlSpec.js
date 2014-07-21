describe('mvUserListCtrl', function () {
  beforeEach(module('compass'));

  var $httpBackend,
    mvUserListCtrl,
    $scope;

  beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/users').respond(function () {
      return [200, [
        {email: 'compass@best.com', _id: '7788'},
        {email: 'compass2@best.com', _id: '8899'}
      ]];
    });
    $httpBackend.expectGET('/api/applicationSettings?fields=positionRightControlled').respond({positionRightControlled: false});
    $scope = $rootScope.$new();
    mvUserListCtrl = $controller('mvUserListCtrl', {
      $scope: $scope
    });
    $httpBackend.flush();
  }));

  it('should get the user list', function () {
    expect($scope.settings.positionRightControlled).to.be.false;
    expect($scope.users).to.have.length(2);
  });

  describe('remove', function () {
    it('should delete /api/users/:id and remove the user from the client', inject(function ($window) {
      $httpBackend.expectDELETE('/api/users/8899').respond(200);
      var confirmStub = sinon.stub($window, 'confirm');
      confirmStub.returns(true);
      $scope.remove($scope.users[1]);
      $httpBackend.flush();
      expect($scope.users).to.have.length(1);
    }));
  });
});