describe('mvOnboardListCtrl', function () {
  beforeEach(module('compass'));
  var $httpBackend,
    $scope,
    oneInterview;

  beforeEach(inject(function ($rootScope, _$httpBackend_, $controller) {
    $httpBackend = _$httpBackend_;
    $scope = $rootScope.$new();
    var today = moment().startOf('day').toISOString();
    var oneMonthLater = moment().add('months', 1).endOf('day').toISOString();
    oneInterview = {
      _id: '7788',
      name: 'zhangsan',
      applyPosition: 'cio',
      onboardDate: '2014-01-02'
    };
    $httpBackend.expectGET('/api/applierRejectReasons').respond(['已接受其他offer', '待遇太差']);
    $httpBackend.expectGET('/api/interviews?endDate=' + oneMonthLater + '&startDate=' + today + '&status=offer+accepted')
      .respond([oneInterview]);
    $controller('mvOnboardListCtrl', {
      $scope: $scope
    });
    $httpBackend.flush();
  }));

  it('should set onboardList', function () {
    expect($scope.onboards).to.have.length(1);
  });

  it('should set applierRejectReasons', function () {
    expect($scope.applierRejectReasons).to.have.length(2);
  });

  it('should use the query condition to search onboards', inject(function () {
    var startDate = moment().add('months', -1).startOf('month');
    var endDate = moment().add('months', -1).endOf('month');

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

  describe('accept', function () {
    it('should set offer status to recruited', inject(function () {
      $httpBackend.expectPUT('/api/interviews/7788', {status: 'recruited'}).respond(200);
      $scope.accept($scope.onboards[0]);
      $httpBackend.flush();
      expect($scope.onboards.length).to.equal(0);
    }));
  });

  describe('reject', function () {
    it('should set offer status to not recruited', function () {
      $scope.reject(oneInterview);
      expect(oneInterview.status).to.equal('not recruited');
    });
  });

  describe('cancel', function () {
    it('should set offer status to not recruited', function () {
      oneInterview.status = 'recruited';
      $scope.cancel(oneInterview);
      expect(oneInterview.status).to.equal('offer accepted');
    });
  });

  describe('save', function () {
    it('should update /api/interviews', inject(function (mvNotifier) {
      var spy = sinon.spy(mvNotifier, 'notify');
      $httpBackend.expectPUT('/api/interviews/7788', {status: 'not recruited', applierRejectReason: 'money'}).respond(200);
      $scope.onboards[0].status = 'not recruited';
      $scope.onboards[0].applierRejectReason = 'money';
      $scope.save($scope.onboards[0]);
      $httpBackend.flush();
      expect(spy).to.have.been.called;
      expect($scope.onboards.length).to.equal(0);
    }));
  });
});