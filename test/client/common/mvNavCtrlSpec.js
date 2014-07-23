describe('mvNavCtrl', function () {

  beforeEach(module('compass'));

  var $httpBackend, $scope, $interval;

  beforeEach(inject(function (_$httpBackend_, $rootScope, mvIdentity, $controller, _$interval_) {
      $httpBackend = _$httpBackend_;
      $scope = $rootScope.$new();
      $interval = _$interval_;

      $httpBackend.expectGET('/api/counts?counts=onboards').respond({onboard: 7});

      $httpBackend.expectGET('/api/counts')
        .respond({new: 1, undetermined: 2, pursued: 3,
          eventsOfToday: 4, interviews: 5, unreviewed: 6});

      $httpBackend.expectGET(/^\/api\/events\?endTime=\d.{22}Z&pageSize=3&startTime=\d.{22}Z&user=7788/)
        .respond([
          {'name': '张三', 'applyPosition': 'Java软件工程师-上海', 'application': '5566', 'createdBy': '7788', 'startTime': '2014-06-04T21:00:00.000Z', 'duration': 60, 'interviewers': ['7788']}
        ]);

      $httpBackend.expectGET('/api/reviews?orderBy=events%5B0%5D.startTime&orderByReverse=false&pageSize=3&unreviewed=true')
        .respond([
          {'_id': '1122', 'name': '张三', 'applyPosition': 'Java软件工程师-上海', 'reviews': [],
            'events': [
              {'duration': 60, 'startTime': '2014-06-06T15:55:00.000Z', 'createdBy': '7788', 'interviewers': ['7788']}
            ]}
        ]);

      $httpBackend.expectGET(/^\/api\/interviews\?endDate=\d.{22}Z&pageSize=3&startDate=\d.{22}Z&status=offer\+accepted/)
        .respond([
          {'name': '张三', 'applyPosition': 'Java软件工程师-上海'}
        ]);

      mvIdentity.currentUser = {
        _id: '7788',
        role : {
          id: '6677',
          permissions:['viewUsers']
        }
      };

      $controller('mvNavCtrl', {
        $scope: $scope
      });

      $httpBackend.flush();
    })
  );

  describe('nav bar counts', function () {
    it('should get count correctly', function () {
      expect($scope.counts.new).to.equal(1);
      expect($scope.counts.undetermined).to.equal(2);
      expect($scope.counts.pursued).to.equal(3);
      expect($scope.counts.eventsOfToday).to.equal(4);
      expect($scope.counts.unreviewed).to.equal(6);
      expect($scope.counts.onboard).to.equal(7);
    });

    it('should run tasks repeatedly', function () {
      $httpBackend.expectGET('/api/counts').respond({});
      $httpBackend.expectGET(/^\/api\/events\?endTime=\d.{22}Z&pageSize=3&startTime=\d.{22}Z&user=7788/).respond([]);
      $httpBackend.expectGET('/api/reviews?orderBy=events%5B0%5D.startTime&orderByReverse=false&pageSize=3&unreviewed=true').respond([]);
      $httpBackend.expectGET(/^\/api\/interviews\?endDate=\d.{22}Z&pageSize=3&startDate=\d.{22}Z&status=offer\+accepted/).respond([]);
      $interval.flush(310000);
      $httpBackend.flush();
    });
  });

  describe('header menu', function () {
    it('should get back events of today', function () {
      expect($scope.eventsForHeader).to.have.length(1);
      expect($scope.eventsForHeader[0].application).to.equal('5566');
      expect($scope.eventsForHeader[0].name).to.equal('张三');
    });

    it('should get back unreviewed list for today', function () {
      expect($scope.unreviewedForHeader).to.have.length(1);
      expect($scope.unreviewedForHeader[0].name).to.equal('张三');
      expect($scope.unreviewedForHeader[0]._id).to.equal('1122');
      expect($scope.unreviewedForHeader[0].applyPosition).to.equal('Java软件工程师-上海');
      expect($scope.unreviewedForHeader[0].events[0].startTime).to.equal('2014-06-06T15:55:00.000Z');
    });

    it('should get back onboards list for today', function () {
      expect($scope.onboardsForHeader).to.have.length(1);
      expect($scope.onboardsForHeader[0].name).to.equal('张三');
      expect($scope.onboardsForHeader[0].applyPosition).to.equal('Java软件工程师-上海');
    });
  });
});
