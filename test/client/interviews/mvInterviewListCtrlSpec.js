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

    $httpBackend.expectGET('/api/interviews?status=unprocessed')
      .respond([
        {
          _id: '1122',
          name: 'user1',
          applyPosition: 'cio',
          events: [
            {
              startTime: '2014-5-18 15:00',
              duration: 90,
              interviewers: ['7788']
            }
          ],
          reviews: [
            {
              qualified: true,
              skill: 9,
              knowledge: 8,
              review: 'excellent software engineer',
              interviewer: '7788'
            }
          ]
        }
      ]);

    $controller('mvInterviewListCtrl',
      {
        $scope: $scope
      });

    $httpBackend.flush();

  }));

  it('should show crumbs correctly', function () {
    expect($scope.crumbs).to.deep.equal([
      {
        text: '待评价',
        url: 'interviews/unprocessed'
      }
    ]);
  });
  describe('/interviews?status=unprocessed', function () {
    it('should show a list of interviews correctly', function () {
      expect($scope.interviews).to.have.length(1);
    });
  });

  describe('newEvent', function () {
    it('should create new event', function () {
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
              },
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
});