describe('mvEventListCtrl', function () {
  beforeEach(module('compass'));

  var $scope,
    $httpBackend;

  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_) {
    $scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/users?fields=name')
      .respond([
        {
          _id: '1122',
          name: 'user1'
        },
        {
          _id: '7788',
          name: 'user2'
        }
      ]);

    $controller('mvEventListCtrl',
      {$scope: $scope,
        mvIdentity: {
          currentUser: {
            _id: '7788'
          }
        }});

    $httpBackend.flush();
  }));

  describe('initialization', function () {
    it('should set crumbs', function () {
      expect($scope.crumbs).to.deep.equal([
        {
          text: '面试日历',
          url: 'events'
        }
      ]);
    });

    it('should set selectedUser', function () {
      expect($scope.selectedUserId).to.equal('7788');
    });

    it('should get users list', function () {
      expect($scope.users).to.have.length(2);
    });

    it('should get /api/events/user=7788?startTime=:startTime&endTime=:endTime', inject(function (mvMoment) {
      var now = mvMoment();
      $scope.start = now.startOf('week').toISOString();
      $scope.end = now.endOf('week').toISOString();
      $httpBackend.expectGET('/api/events?endTime=' + $scope.end + '&startTime=' + $scope.start + '&user=7788')
        .respond([
          {
            _id: '777',
            interviewers: ['aa'],
            interviewerNames: ['张三'],
            name: '李四',
            applyPosition: '销售经理',
            mobile: '13838383838',
            email: 'aa@aa.com',
            createdBy: '7788',
            createdByUserName: '王五',
            startTime: mvMoment([2010, 0, 31, 14, 20, 0, 0]).toDate(),
            duration: 90
          }
        ]);

      $scope.retrieveEvents();
      $httpBackend.flush();

      expect($scope.events).to.have.length(1);
      expect($scope.eventsForCalendar).to.have.length(1);
      expect($scope.eventsForCalendar[0]).to.have.property('title', '李四面试(销售经理)');
      expect($scope.eventsForCalendar[0].start.getTime()).to.equal(mvMoment([2010, 0, 31, 14, 20, 0, 0]).toDate().getTime());
      expect($scope.eventsForCalendar[0].end.getTime()).to.equal(mvMoment([2010, 0, 31, 15, 50, 0, 0]).toDate().getTime());
    }));
  });

  describe('showModal', function () {
    var modalOpenStub,
      fakeModal,
      event;
    beforeEach(inject(function ($modal) {
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
          this.reuslt.cancelCallback(item);
        }
      };

      modalOpenStub = sinon.stub($modal, 'open');
      modalOpenStub.returns(fakeModal);

      event = {
        _id: '7788',
        name: '张三',
        mobile: '137373737',
        email: 'aa@aa.com',
        time: new Date(),
        duration: 90
      };

      $scope.events = [event];
      $scope.eventsForCalendar = [
        {
          id: '7788',
          duration: 90
        }
      ];
    }));

    it('should open the modal', function () {
      $scope.showModal($scope.eventsForCalendar[0]);
      expect(modalOpenStub).to.have.been.called;
    });
    it('should update the local events', inject(function (mvMoment) {
      var newTime = mvMoment([2014, 9, 10, 18, 0, 0, 0]).toDate();
      $scope.showModal($scope.eventsForCalendar[0]);
      fakeModal.close({
        _id: '7788',
        duration: 60,
        startTime: newTime
      });
      expect($scope.eventsForCalendar[0].start.toString()).to.equal(newTime.toString());
      expect($scope.eventsForCalendar[0].end.toString()).to.equal(mvMoment(newTime).add('minutes', 60).toDate().toString());
    }));

    it('should delete the event from the calendar and $scope.events', function () {
      $scope.showModal($scope.eventsForCalendar[0]);
      fakeModal.close();
      expect($scope.eventsForCalendar).to.have.length(0);
      expect($scope.events).to.have.length(0);
    });
  });

  describe('sync draganddrop and resize', function () {
    it('should update /api/events/:id and update the events', inject(function (mvMoment) {
      $httpBackend.expectPUT('/api/events/7788', {
        _id: '7788',
        startTime: mvMoment([2019, 5, 5, 8, 0, 0, 0]).toISOString(),
        duration: 60
      }).respond(200);


      $scope.events = [
        {
          _id: '7788',
          startTime: mvMoment([2014, 5, 5, 0, 0, 0, 0]).toDate(),
          duration: 90
        }
      ];
      $scope.sync({
        id: '7788',
        start: mvMoment([2019, 5, 5, 8, 0, 0, 0]).toDate(),
        end: mvMoment([2019, 5, 5, 9, 0, 0, 0]).toDate()
      });
      $httpBackend.flush();
      expect($scope.events[0].startTime.toString()).to.equal(mvMoment([2019, 5, 5, 8 , 0, 0, 0]).toDate().toString());
    }));
  });

  describe('change selectedUserId', function () {
    it('should retrieve events', inject(function (mvMoment) {
      var now = mvMoment();
      $scope.start = now.startOf('week').toISOString();
      $scope.end = now.endOf('week').toISOString();
      $httpBackend.expectGET('/api/events?endTime=' + $scope.end + '&startTime=' + $scope.start + '&user=1122')
        .respond(200);
      $scope.selectedUserId = '1122';
      $scope.retrieveEvents();
      $httpBackend.flush();
    }));
  });
});