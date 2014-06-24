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

    $httpBackend.expectGET('/sysAdminApi/emailCount').respond({emailCount: 10});
    $httpBackend.expectGET('/sysAdminApi/resumeCounts').respond({resumeCountInEs: 500, resumeCountInDb: 600, mailCount: 800});
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

  describe('recreateAllJobs', function () {
    it('should post /sysAdminApi/recreateAllJobs', function () {
      $httpBackend.expectPOST('/sysAdminApi/recreateAllJobs').respond(200);
      $httpBackend.expectGET('/tasks/stats').respond({});
      $httpBackend.expectGET('/sysAdminApi/emailCount').respond({});
      $scope.recreateAllJobs();
      $httpBackend.flush();
      expect($scope.taskStats).to.deep.equal({});
    });
  });

  describe('recreateFetchEmailJobs', function () {
    it('should post /sysAdminApi/recreateFetchEmailJobs', function () {
      $httpBackend.expectPOST('/sysAdminApi/recreateFetchEmailJobs').respond(200);
      $httpBackend.expectGET('/tasks/stats').respond({});
      $httpBackend.expectGET('/sysAdminApi/emailCount').respond({});
      $scope.recreateFetchEmailJobs();
      $httpBackend.flush();
      expect($scope.taskStats).to.deep.equal({});
    });
  });

  describe('synchronizeEsToDb', function () {
    it('should post /sysAdminApi/synchronizeEsToDb', function () {
      $httpBackend.expectPOST('/sysAdminApi/synchronizeEsToDb').respond(200);
      $httpBackend.expectGET('/sysAdminApi/resumeCounts').respond({mailCount: 200});
      $scope.synchronizeEsToDb();
      $httpBackend.flush();
      expect($scope.mailCount).to.equal(200);
    });
  });

  describe('reparseMails', function () {
    it('should post /sysAdminApi/reparseMails', function () {
      $httpBackend.expectPOST('/sysAdminApi/reparseMails').respond(200);
      $httpBackend.expectGET('/sysAdminApi/resumeCounts').respond({mailCount: 200});
      $scope.reparseMails();
      $httpBackend.flush();
      expect($scope.mailCount).to.equal(200);
    });
  });
});