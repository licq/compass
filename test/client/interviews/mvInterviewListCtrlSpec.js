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

    $httpBackend.expectGET('/api/interviews')
      .respond([
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
      ]);

    $controller('mvInterviewListCtrl', { $scope: $scope });
    $httpBackend.flush();
  }));

  describe('initialization', function () {
    it('should show a list of interviews correctly', function () {
      expect($scope.interviews).to.have.length(1);
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
  });

  describe('newEvent', function () {
    it('should show modal dialog', function () {
      $scope.newEvent($scope.interviews[0]);
      expect(modalOpenStub).to.be.called;
    });

    it('should update the page', function () {
      $scope.newEvent($scope.interviews[0]);
      $httpBackend.expectGET('/api/interviews/' + $scope.interviews[0]._id).respond({
        _id: $scope.interviews[0]._id,
        events: [
          {
            startTime: new Date(),
            interviewers: [
              {
                _id: '7788',
                name: '7788'
              }
            ]
          },
          {
            startTime: new Date(),
            interviewers: [
              {
                _id: '8899',
                name: '8899'
              }
            ]
          }
        ]
      });
      fakeModal.close({
        name: 'user1',
        startTime: new Date(),
        interviewers: ['7788', '8899']
      });
      $httpBackend.flush();
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
