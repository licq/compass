describe('mvUserListCtrl', function () {
  beforeEach(module('compass'));

  var $httpBackend,
    mvUserListCtrl,
    $scope;

  beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/users').respond(function () {
      return [200, [
        {email: 'compass@best.com'},
        {email: 'compass2@best.com'}
      ]];
    });

    $scope = $rootScope.$new();
    mvUserListCtrl = $controller('mvUserListCtrl', {
      $scope: $scope
    });
  }));

  it('should get the user list', function () {
    $httpBackend.flush();

    expect($scope.users).to.have.length(2);
  });
});