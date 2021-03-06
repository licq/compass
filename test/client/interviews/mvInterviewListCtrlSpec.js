describe('mvInterviewListCtrl', function () {
  beforeEach(module('compass'));

  var $scope,
    $httpBackend,
    fakeModal,
    modalOpenStub;

  beforeEach(inject(function ($rootScope, _$httpBackend_, $controller, $modal) {
    $httpBackend = _$httpBackend_;
    $scope = $rootScope.$new();

    fakeModal = {
      result: {
        then: function (confirmCallback, cancelCallback) {
          this.confirmCallback = confirmCallback;
          this.cancelCallback = cancelCallback;
        }
      },
      close: function (item) {
        this.result.confirmCallback(item);
      },
      dismiss: function (item) {
        this.result.cancelCallback(item);
      }
    };

    modalOpenStub = sinon.stub($modal, 'open');
    modalOpenStub.returns(fakeModal);

    $httpBackend.expectGET('/api/applyPositions?for=company').respond([
      'Java工程师', '销售总监', '前台'
    ]);
    $httpBackend.expectGET('/api/interviews?page=1&pageSize=20&status=new')
      .respond(function () {
        return [200, [
          {
            _id: '1122',
            name: 'user1',
            applyPosition: 'cio',
            events: [
              {
                startTime: '2014-5-18 15:00',
                duration: 90,
                interviewers: [
                  {
                    _id: '7788',
                    name: 'zhangsan'
                  }
                ]
              }
            ],
            reviews: [
              {
                qualified: true,
                items: [
                  {name: 'skill', score: 9, rate: 1},
                  {name: 'knowledge', score: 8, rate: 1}
                ],
                review: 'excellent software engineer',
                interviewer: {
                  _id: '7788',
                  name: 'zhangsan'
                },
                totalScore: 17
              }
            ]
          }
        ], {'totalCount': '20'}];
      });

    $controller('mvInterviewListCtrl', { $scope: $scope });
    $httpBackend.flush();
  }));

  describe('initialization', function () {
    it('should show a list of interviews correctly', function () {
      expect($scope.interviews).to.have.length(1);
    });

    it('should set applyPositions', function () {
      expect($scope.applyPositions).to.have.length(3);
    });

    it('should calculate the averageTotalScore', function () {
      expect($scope.interviews[0]).to.have.property('averageTotalScore', 17);
    });

    it('should set the qualifiedSummaries of interview', function () {
      expect($scope.interviews[0].qualifiedSummaries).to.deep.equal([
        {name: 'zhangsan', qualified: true}
      ]);
    });

    it('should set the averageFieldScores', function () {
      expect($scope.interviews[0].averageFieldScores).to.deep.equal([
        {name: 'skill', score: 9},
        {name: 'knowledge', score: 8}
      ]);
    });

    it('should set the totalInterviewsCount', function () {
      expect($scope.totalInterviewsCount).to.equal(20);
    });

    it('should set the default queryoptions', inject(function (states) {
      var queryOptions = states.get('mvInterviewListCtrl');
      expect(queryOptions).to.deep.equal({
        pageSize: 20,
        page: 1,
        status: 'new'
      });

      expect($scope.queryOptions).to.equal(queryOptions);
    }));
  });

  describe('search', function () {
    it('should retrieve the interviewlist again', function () {
      $httpBackend.expectGET('/api/interviews?interviewStatus=complete&name=zhangsan&page=1&pageSize=20&status=new').respond(200);
      $scope.queryOptions.page = 1;
      $scope.queryOptions.name = 'zhangsan';
      $scope.queryOptions.interviewStatus = 'complete';
      $scope.search();
      $httpBackend.flush();
    });
  });

  describe('clear queryOptions', function () {
    it('should clear the query condition and retrieve the interview list', function () {
      $httpBackend.expectGET('/api/interviews?applyPosition=&interviewStatus=&name=&page=1&pageSize=20&startDate=&status=new').respond(200);
      $scope.queryOptions.page = 3;
      $scope.queryOptions.name = 'beijing';
      $scope.clearQueryOptions();
      $httpBackend.flush();

      expect($scope.queryOptions).to.deep.equal({
        page: 1,
        pageSize: 20,
        name: '',
        applyPosition: '',
        startDate: '',
        status: 'new',
        interviewStatus: ''
      });
    });
  });

  describe('newEvent', function () {
    it('should show modal dialog', function () {
      $scope.newEvent($scope.interviews[0]);
      expect(modalOpenStub).to.be.called;
    });

    it('should update the page', function () {
      $scope.newEvent($scope.interviews[0]);
      fakeModal.close({
        name: 'user1',
        startTime: moment(),
        interviewers: [
          {_id: '7788', name: 'aabb'},
          {_id: '8899', name: 'bbcc'}
        ]
      });
      expect($scope.interviews[0].events).to.have.length(2);
    });
  });

  describe('view', function () {
    it('should go to interview view page', inject(function ($location) {
      var spyPath = sinon.spy($location, 'path');
      $scope.view('1234');
      expect(spyPath).have.been.calledWith('/interviews/1234');
    }));
  });
});