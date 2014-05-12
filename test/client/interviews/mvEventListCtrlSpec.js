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
      var today = mvMoment();
      var startTime = today.startOf('week').format('YYYY-MM-DD');
      var endTime = today.endOf('week').format('YYYY-MM-DD');
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
      $httpBackend.flush();

      expect($scope.events).to.have.length(1);
      expect($scope.eventsForCalendar).to.have.length(1);
      expect($scope.eventsForCalendar[0]).to.have.property('title', '李四面试(销售经理)');
      expect($scope.eventsForCalendar[0].start.getTime()).to.equal(mvMoment([2010, 0, 31, 14, 20, 0, 0]).toDate().getTime());
      expect($scope.eventsForCalendar[0].end.getTime()).to.equal(mvMoment([2010, 0, 31, 15, 50, 0, 0]).toDate().getTime());
    }));
  });
});