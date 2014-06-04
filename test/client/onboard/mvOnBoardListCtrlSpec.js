describe('mvOnboardListCtrl', function () {
  beforeEach(module('compass'));
  var $httpBackend,
    $scope;

  beforeEach(inject(function ($rootScope, _$httpBackend_, $controller, mvMoment) {
    $httpBackend = _$httpBackend_;
    $scope = $rootScope.$new();
    var today = mvMoment().startOf('day').toISOString();
    var oneMonthLater = mvMoment().add('months', 1).endOf('day').toISOString();
    $httpBackend.expectGET('/api/interviews?endDate=' + oneMonthLater + '&startDate=' + today + '&status=offer+accepted').respond([
      {
        name: 'zhangsan',
        applyPosition: 'cio',
        onboardDate: new Date()
      }
    ]);
    $controller('mvOnboardListCtrl', {
      $scope: $scope
    });
    $httpBackend.flush();
  }));

  it('should set onboardList', function () {
    expect($scope.onboards).to.have.length(1);
  });

  it('should use the query condition to search onboards', inject(function (mvMoment) {
    var startDate = mvMoment().add('months', -1).startOf('month');
    var endDate = mvMoment().add('months', -1).endOf('month');

    $httpBackend.expectGET('/api/interviews?endDate=' + endDate.toISOString() +
      '&name=lisi&startDate=' + startDate.toISOString() + '&status=offer+accepted').respond(200);

    $scope.dateRange = {
      startDate: startDate,
      endDate: endDate
    };
    $scope.name = 'lisi';
    $scope.query();
    $httpBackend.flush();
  }));
});