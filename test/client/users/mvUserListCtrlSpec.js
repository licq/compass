describe('mvUserListCtrl', function () {
  beforeEach(module('compass'));

  var $httpBackend,
    mvUserListCtrl,
    $scope;

  beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/users').respond(function () {
      return [200, [
        {email: 'compass@best.com', _id: '7788', deleted : false},
        {email: 'compass1@best.com', _id: '8899', deleted : false},
        {email: 'compass2@best.com', _id: '9900', deleted: true},
        {email: 'compass3@best.com', _id: '0011', deleted: true}
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
    expect($scope.users).to.have.length(4);
    expect($scope.normalUsers).to.have.length(2);
    expect($scope.deletedUsers).to.have.length(2);
    expect($scope.displayUsers).to.have.length(2);
    expect($scope.showDeleted).to.be.false;

  });

  describe('remove', function () {
    it('should delete /api/users/:id and remove the user from the client', inject(function ($window) {
      $httpBackend.expectDELETE('/api/users/8899').respond(200);
      var confirmStub = sinon.stub($window, 'confirm');
      confirmStub.returns(true);
      $scope.remove($scope.users[1]);
      $httpBackend.flush();
      expect($scope.users).to.have.length(4);
      expect($scope.normalUsers).to.have.length(1);
      expect($scope.deletedUsers).to.have.length(3);
      expect($scope.displayUsers).to.have.length(1);
      $scope.showDeleted = true;
      $scope.refreshDisplay();
      expect($scope.users).to.have.length(4);
      expect($scope.normalUsers).to.have.length(1);
      expect($scope.deletedUsers).to.have.length(3);
      expect($scope.displayUsers).to.have.length(4);
    }));
  });

  describe('enable', function () {
    it('should enable deleted user by /api/users/:id/enable', inject(function () {
      $httpBackend.expectPUT('/api/users/9900/enable').respond(200);
      $scope.enable($scope.users[2]);
      $httpBackend.flush();
      expect($scope.users).to.have.length(4);
      expect($scope.normalUsers).to.have.length(3);
      expect($scope.deletedUsers).to.have.length(1);
      expect($scope.displayUsers).to.have.length(3);
      $scope.showDeleted = true;
      $scope.refreshDisplay();
      expect($scope.users).to.have.length(4);
      expect($scope.normalUsers).to.have.length(3);
      expect($scope.deletedUsers).to.have.length(1);
      expect($scope.displayUsers).to.have.length(4);
    }));
  });
});