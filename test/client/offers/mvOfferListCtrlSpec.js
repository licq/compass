describe('mvOfferListCtrl', function () {
  beforeEach(module('compass'));

  var $scope,
    $httpBackend,
    oneInterview;

  beforeEach(inject(function ($rootScope, $controller, _$httpBackend_) {
    oneInterview = {
      _id: '7788',
      name: 'zhangsan',
      status: 'new',
      events: [
        {
          startTime: new Date(),
          duration: 90,
          interviewers: [
            {
              _id: '112',
              name: 'baozheng'
            }
          ]
        }
      ],
      reviews: [
        {
          interviewer: {
            _id: '112',
            name: 'baozheng'
          }
        }
      ]
    };
    $scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/applierRejectReasons').respond(['已接受其他offer','待遇太差']);
    $httpBackend.expectGET('/api/interviews?status=offered').respond(function () {
      return [200, [
        oneInterview
      ], {'totalCount': 20}];
    });

    $controller('mvOfferListCtrl', {
      $scope: $scope
    });

    $httpBackend.flush();
  }));

  it('should get offered list', function () {
    expect($scope.offers).to.have.length(1);
    expect($scope.totalOffersCount).to.equal(20);
  });

  it('should set today', function () {
    expect($scope.today).to.exist;
  });

  it('should set applierRejectReasons', function () {
    expect($scope.applierRejectReasons).to.have.length(2);
  });

  describe('clearQueryOptions', function () {
    it('should get offer list', function () {
      $scope.name = 'zhangsan';

      $httpBackend.expectGET('/api/interviews?name=&status=offered').respond(200);
      $scope.clearQueryOptions();
      $httpBackend.flush();
      expect($scope.name).to.equal('');
    });
  });

  describe('accept', function () {
    it('should set offer status to offer accepted', function () {
      $scope.accept(oneInterview);
      expect(oneInterview.status).to.equal('offer accepted');
    });
  });

  describe('reject', function () {
    it('should set offer status to offer rejected', function () {
      $scope.reject(oneInterview);
      expect(oneInterview.status).to.equal('offer rejected');
    });
  });

  describe('save', function () {
    it('should update /api/interviews', inject(function (mvNotifier) {
      var spy = sinon.spy(mvNotifier, 'notify');
      $httpBackend.expectPUT('/api/interviews/7788', {status: 'offer rejected', applierRejectReason: 'money'}).respond(200);
      $scope.offers[0].status = 'offer rejected';
      $scope.offers[0].applierRejectReason = 'money';
      $scope.save($scope.offers[0]);
      $httpBackend.flush();
      expect(spy).to.have.been.called;
      expect($scope.offers.length).to.equal(0);
    }));
  });

});
