describe('mvSystemOperationsCtrl', function () {
  beforeEach(module('compass'));

  var $scope, $httpBackend;
  beforeEach(inject(function ($rootScope, _$httpBackend_, $controller) {
    $scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/tasks/stats').respond({
      'inactiveCount': 1,
      'completeCount': 1690,
      'activeCount': 36,
      'failedCount': 287,
      'delayedCount': 1,
      'workTime': 2653278
    });

    $httpBackend.expectGET('/api/emailCount').respond({emailCount: 10});
    $httpBackend.expectGET('/api/resumeCounts').respond({resumeCountInEs: 500, resumeCountInDb: 600, mailCount: 800});
    $controller('mvSystemOperationsCtrl', {
      $scope: $scope
    });
    $httpBackend.flush();
  }));

  describe('initialization', function () {
    it('should get the kue jobs stats', function () {
      expect($scope.taskStats).to.have.property('inactiveCount', 1);
    });

    it('should get the count of all the emails', function () {
      expect($scope.emailCount).to.equal(10);
    });

    it('should get the resume counts of the es', function () {
      expect($scope.resumeCountInEs).to.equal(500);
    });

    it('should get the resume counts of the db', function () {
      expect($scope.resumeCountInDb).to.equal(600);
    });

    it('should get the mailcount ', function () {
      expect($scope.mailCount).to.equal(800);
    });
  });
});