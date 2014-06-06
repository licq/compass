describe('mvNavCtrl', function () {

  beforeEach(module('compass'));

  var $httpBackend, $scope, $interval;

  beforeEach(inject(function (_$httpBackend_, $rootScope, mvIdentity, $controller, _$interval_) {
      $httpBackend = _$httpBackend_;
      $scope = $rootScope.$new();
      $interval = _$interval_;
      $httpBackend.expectGET('/api/counts')
        .respond({new: 1, undetermined: 2, pursued: 3,
          eventsOfToday: 4, interviews: 5, toBeReviewed: 6});
      $httpBackend.expectGET(/^\/api\/events\?endTime=\d.{22}Z&limit=3&startTime=\d.{22}Z&user=7788/)
        .respond([
          {'name': '张三', 'applyPosition': 'Java软件工程师-上海', 'createdBy': '7788', 'startTime': '2014-06-04T21:00:00.000Z', 'duration': 60, 'interviewers': ['7788']}
        ]);
      $httpBackend.expectGET('/api/reviews?limit=3&orderBy=events%5B0%5D.startTime&orderByReverse=false&unreviewed=true')
        .respond([
          {'_id': '1122', 'name': '张三', 'applyPosition': 'Java软件工程师-上海', 'reviews': [],
            'events': [
              {'duration': 60, 'startTime': '2014-06-06T15:55:00.000Z', 'createdBy': '7788', 'interviewers': ['7788']}
            ]}
        ]);

      mvIdentity.currentUser = {
        _id: '7788'
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
      expect($scope.counts.interviews).to.equal(5);
      expect($scope.counts.toBeReviewed).to.equal(6);
    });

    it('should run tasks repeatedly', function () {
      $httpBackend.expectGET('/api/counts').respond({});
      $httpBackend.expectGET(/^\/api\/events\?endTime=\d.{22}Z&limit=3&startTime=\d.{22}Z&user=7788/).respond([]);
      $httpBackend.expectGET('/api/reviews?limit=3&orderBy=events%5B0%5D.startTime&orderByReverse=false&unreviewed=true').respond([]);
      $interval.flush(310000);
      $httpBackend.flush();
    });
  });

  describe('header menu', function () {
    it('should get back events of today', function () {
      expect($scope.eventsForHeader).to.have.length(1);
      expect($scope.eventsForHeader[0].title).to.equal('张三面试(Java软件工程师-上海)');
    });

    it('should get back unreviewed list', function () {
      expect($scope.unreviewedForHeader).to.have.length(1);
      expect($scope.unreviewedForHeader[0].name).to.equal('张三');
      expect($scope.unreviewedForHeader[0].interviewId).to.equal('1122');
      expect($scope.unreviewedForHeader[0].applyPosition).to.equal('Java软件工程师-上海');
      expect($scope.unreviewedForHeader[0].startTime).to.equal('2014-06-06T15:55:00.000Z');
    });
  });
});
