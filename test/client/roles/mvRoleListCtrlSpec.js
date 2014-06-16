describe('mvRoleListCtrl', function () {
  beforeEach(module('compass'));

  var $httpBackend,
    mvRoleListCtrl,
    $scope;

  beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/roles').respond(function () {
      return [200,[
        {name: 'admin', permissions: ['viewResumeList', 'deleteUser']},
        {name: 'guest', permissions: ['viewHomepage']}
      ]];
    });

    $scope = $rootScope.$new();
    mvRoleListCtrl = $controller('mvRoleListCtrl', {
      $scope: $scope
    });
  }));

  it('should get the role list', function () {
    $httpBackend.flush();

    expect($scope.roles).to.have.length(2);
  });
});