describe('mvMailListCtrl', function () {
  beforeEach(module('compass'));

  var $httpBackend,
    mvMailListCtrl,
    $scope;

  beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/mails?page=1&pageSize=20').respond(function () {
      return[200, [
        {address: 'compass@best.com'}
      ], {'totalCount': 20}];
    });

    $scope = $rootScope.$new();
    mvMailListCtrl = $controller('mvMailListCtrl', {
      $scope: $scope
    });

    $scope.query();
  }));

  it('should get the email list', function () {
    $httpBackend.flush();

    expect($scope.mails).to.have.length(1);
    expect($scope.totalMailsCount).to.equal(20);
  });
});