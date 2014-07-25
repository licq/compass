describe('mvInterviewViewCtrl', function () {

  beforeEach(module('compass'));

  var $httpBackend,
    $scope,
    fakeModal,
    modalOpenStub;

  beforeEach(inject(function ($rootScope, _$httpBackend_, $controller, $modal) {
    $scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    $controller('mvInterviewViewCtrl', {
      $scope: $scope,
      $routeParams: {id: '7788'},
      mvIdentity: {
        currentUser: {
          _id: '112',
          name: '包拯'
        }
      }
    });

    $httpBackend.expectGET('/api/interviews/7788').respond({
      _id: '7788',
      name: '张三',
      applyPosition: 'cio',
      events: [
        {
          _id: '7788',
          startTime: new Date(),
          duration: 90,
          interviewers: ['112']
        }
      ],
      reviews: [
        {
          interviewer: {
            _id: '112'
          },
          items: [
            {name: '学习能力', rate: 1, score: 4},
            {name: '工作态度', rate: 1, score: 3},
            {name: '团队合作', rate: 1, score: 5},
            {name: '沟通能力', rate: 1, score: 5}
          ]
        }
      ]
    });

    $httpBackend.flush();

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

  }));

  it('should return an interview', function () {
    expect($scope.interview).to.exist;
    expect($scope.interview).to.have.property('name');
  });

  it('should set reviewTable', function () {
    expect($scope.reviewHeader).to.deep.equal(
      ['学习能力', '工作态度', '团队合作', '沟通能力']);
    expect($scope.reviewData).to.deep.equal({
      '112': {
        '学习能力': 4,
        '工作态度': 3,
        '团队合作': 5,
        '沟通能力': 5
      }
    });
  });

  it('should go to /interviews/list', inject(function ($location) {
    var spy = sinon.spy($location, 'path');
    $scope.cancel();
    expect(spy).to.have.been.calledWith('/interviews/list');
  }));

  describe('offer', function () {
    it('should put to /api/interviews/1234?status offered', inject(function ($location, mvNotifier) {
      var spyLocation = sinon.spy($location, 'path');
      var spyNotifier = sinon.spy(mvNotifier, 'notify');
      $httpBackend.expectPUT('/api/interviews/7788', {status: 'offered'}).respond(200);
      $scope.offer();
      $httpBackend.flush();
      expect($scope.interview.status).to.equal('offered');
      expect(spyLocation).to.have.been.calledWith('/interviews/list');
      expect(spyNotifier).to.have.been.called;
    }));
  });

  describe('reject', function () {
    it('should put to /api/interviews/1234 with status rejected', inject(function ($location, mvNotifier) {
      var spyLocation = sinon.spy($location, 'path');
      var spyNotifier = sinon.spy(mvNotifier, 'notify');
      $httpBackend.expectPUT('/api/interviews/7788', {status: 'rejected'}).respond(200);
      $scope.reject();
      $httpBackend.flush();
      expect($scope.interview.status).to.equal('rejected');
      expect(spyLocation).to.have.been.calledWith('/interviews/list');
      expect(spyNotifier).to.have.been.called;
    }));
  });

  describe('newEvent', function () {
    it('should add one event to events', function () {
      $scope.newEvent();
      expect(modalOpenStub).to.be.called;
    });

    it('should add one new event the events', function () {
      $scope.newEvent();
      $httpBackend.expectGET('/api/interviews/7788').respond({
        _id: '7788',
        name: '张三',
        applyPosition: 'cio',
        events: [
          {
            _id: '7788',
            startTime: new Date(),
            duration: 90,
            interviewers: ['112']
          }
        ],
        reviews: [
          {
            interviewer: {
              _id: '112'
            },
            items: [
              {name: '学习能力', rate: 1, score: 4},
              {name: '工作态度', rate: 1, score: 3},
              {name: '团队合作', rate: 1, score: 5},
              {name: '沟通能力', rate: 1, score: 5}
            ]
          }
        ]
      });
      fakeModal.close({
        name: 'user1',
        startTime: new Date(),
        interviewers: [
          {_id: '7788', name: 'aabb'},
          {_id: '8899', name: 'bbcc'}
        ]
      });
      $httpBackend.flush();
      expect($scope.interview.events).to.have.length(1);
    });
  });

  describe('editEvent', function () {
    it('should edit one event to events', function () {
      $scope.editEvent({
          _id: '7788',
          startTime: new Date(),
          duration: 90,
          interviewers: ['112']
        }
      );
      expect(modalOpenStub).to.be.called;
    });

    it('should retrieve the interview again', function () {
      $scope.editEvent({
          _id: '7788',
          startTime: new Date(),
          duration: 90,
          interviewers: ['112']
        }
      );
      $httpBackend.expectGET('/api/interviews/7788').respond({
        _id: '7788',
        name: '张三',
        applyPosition: 'cio',
        events: [
          {
            _id: '7788',
            startTime: new Date(),
            duration: 90,
            interviewers: [
              {
                _id: '7788',
                name: 'aabb'
              },
              {
                _id: '8899',
                name: 'bbcc'
              }
            ]
          }
        ],
        reviews: [
          {
            interviewer: {
              _id: '112'
            },
            items: [
              {name: '学习能力', rate: 1, score: 4},
              {name: '工作态度', rate: 1, score: 3},
              {name: '团队合作', rate: 1, score: 5},
              {name: '沟通能力', rate: 1, score: 5}
            ]
          }
        ]
      });
      fakeModal.close({
        name: 'user1',
        startTime: new Date(),
        interviewers: [
          {_id: '7788', name: 'aabb'},
          {_id: '8899', name: 'bbcc'}
        ]
      });
      $httpBackend.flush();
      expect($scope.interview.events).to.have.length(1);
    });
  });

  describe('removeEvent', function () {
    it('should remove an existing event and broadcast the messsage', inject(function ($rootScope,mvNotifier) {
      var spy = sinon.spy($rootScope, '$broadcast');
      var notifySpy = sinon.spy(mvNotifier, 'notify');
      $httpBackend.expectDELETE('/api/events/7788').respond(200);
      var eventStartDate = new Date();
      $scope.removeEvent({
          _id: '7788',
          startTime: eventStartDate,
          duration: 90,
          interviewers: [
            {
              _id: '7788',
              name: 'aabb'
            },
            {
              _id: '8899',
              name: 'bbcc'
            }
          ]
        }
      );
      $httpBackend.flush();
      expect($scope.interview.events).to.have.length(0);
      expect(spy).to.have.been.calledWith('changeOfEvent','delete',null, eventStartDate);
      expect(notifySpy).to.have.been.calledWith('删除面试邀请成功');
    }));
  });
});