describe('mvEventListCtrl', function () {
  beforeEach(module('compass'));

  var $scope,
    $httpBackend;

  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_) {
    $scope = $rootScope.$new();
    $controller('mvEventListCtrl',
      {$scope: $scope,
        mvIdentity: {
          currentUser: {
            _id: '7788'
          }
        }});
    $httpBackend = _$httpBackend_;
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

    it('should get /api/events/user=7788?startTime=:startTime&endTime=:endTime', inject(function (mvMoment) {
      var now = mvMoment();
      var startTime = now.startOf('week').toISOString();
      var endTime = now.endOf('week').toISOString();
      $httpBackend.expectGET('/api/events?endTime=' + endTime + '&startTime=' + startTime + '&user=7788')
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
            time: mvMoment([2010, 0, 31, 14, 20, 0, 0]).toDate(),
            duration: 90
          }
        ]);

      $scope.retrieveEvents(startTime, endTime);
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
        id: '7788',
        name: '张三',
        mobile: '137373737',
        email: 'aa@aa.com',
        time: new Date()
      };

      $scope.events = [event];
    }));

    it('should open the modal', function () {
      $scope.showModal(event);
        expect(modalOpenStub).to.have.been.called;
    });
  });
});