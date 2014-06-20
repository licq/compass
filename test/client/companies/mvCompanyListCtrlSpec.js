describe('mvCompanyListCtrl', function () {
  beforeEach(module('compass'));

  var $httpBackend,
    mvCompanyListCtrl,
    $scope;

  beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/sysAdminApi/companies').respond(function () {
      return [200, [
        {name: 'compass1'},
        {name: 'compass2'},
        {name: 'compass3'}
      ]];
    });

    $scope = $rootScope.$new();
    mvCompanyListCtrl = $controller('mvCompanyListCtrl', {
      $scope: $scope
    });
  }));

  it('should get the company list', function () {
    $httpBackend.flush();

    expect($scope.companies).to.have.length(3);
  });
});