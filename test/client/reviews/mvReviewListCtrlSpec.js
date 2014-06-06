describe('mvReviewListCtrl', function () {
  beforeEach(module('compass'));

  var $scope,
    resultFunction,
    $httpBackend;

  beforeEach(inject(function ($rootScope, _$httpBackend_, $controller) {
    $httpBackend = _$httpBackend_;
    $scope = $rootScope.$new();

    $httpBackend.expectGET('/api/applyPositions').respond(['Java软件工程师', '市场销售主管']);
    resultFunction = function () {
      return [200, [
        {
          _id: '7788',
          events: {
            interviewers: [
              {
                _id: 'aaa',
                name: 'a',
                score: 20,
                qualified: true
              },
              {
                _id: 'bbb',
                name: 'b'
              }
            ],
            startTime: new Date(),
            duration: 90
          },
          reviews: [
            {
              items: [],
              totalScore: 15,
              qualified: true
            }
          ]
        }
      ], {totalCount: 20}];
    };
    $httpBackend.expectGET('/api/reviews?orderBy=events%5B0%5D.startTime&orderByReverse=true&page=1&pageSize=20').respond(resultFunction);

    $controller('mvReviewListCtrl', {
      $scope: $scope
    });

    $scope.query();
    $httpBackend.flush();
  }));

  describe('initialization', function () {
    it('should get all the interviews for current user', function () {
      expect($scope.applyPositions).to.have.length(2);
      expect($scope.totalInterviewsCount).to.equal(20);
      expect($scope.interviews).to.have.length(1);
    });

    it('should set today', function () {
      expect($scope.today).to.exist;
    });

    it('should set default options', inject(function (states) {
      expect(states.get('mvReviewListCtrl').queryOptions).to.deep.equal({
        page: 1,
        orderBy: 'events[0].startTime',
        orderByReverse: true,
        pageSize: 20
      });

      $scope.queryOptions.name = 'hello';
      expect($scope.queryOptions).to.deep.equal({
        page: 1,
        orderBy: 'events[0].startTime',
        orderByReverse: true,
        name: 'hello',
        pageSize: 20
      });
    }));

    it('should clear revert to the default options and query the reviews', function () {
      $httpBackend.expectGET('/api/reviews?applyPosition=&name=&orderBy=events%5B0%5D.startTime&orderByReverse=true&page=1&pageSize=20&startDate=').respond(resultFunction);
      $scope.queryOptions.name = 'beijing';
      $scope.clearQueryOptions();
      expect($scope.queryOptions.page).to.equal(1);
      expect($scope.queryOptions.name).to.equal('');
      $httpBackend.flush();
    });

    it('should set page to 1 and query the reviews', function () {
      $httpBackend.expectGET('/api/reviews?name=beijing&orderBy=events%5B0%5D.startTime&orderByReverse=true&page=1&pageSize=20').respond(resultFunction);
      $scope.queryOptions.name = 'beijing';
      $scope.search();
      expect($scope.queryOptions.page).to.equal(1);
      $httpBackend.flush();
    });
  });

  describe('view', function () {
    it('should go to the view page', inject(function ($location) {
      var spy = sinon.spy($location, 'path');
      $scope.view({_id: '7788'});
      expect(spy).to.have.been.calledWith('/interviews/reviews/7788');
    }));
  });
});