describe('mvResetCtrl', function () {
  beforeEach(module('compass'));
  var $httpBackend, $scope;
  beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
    $httpBackend = _$httpBackend_;
    $scope = $rootScope.$new();
    $controller('mvResetCtrl', {
      $scope: $scope,
      $routeParams: {token: '778899'}
    });
  }));

  it('should put successfully', function () {

    $scope.password = '123456';
    var data = {
      token: '778899',
      password: $scope.password
    };

    $httpBackend.expectPUT('/publicApi/forgot', data).respond(200);
    $scope.reset();
    $httpBackend.flush();
    expect($scope.resetted).to.be.true;
  });
});
