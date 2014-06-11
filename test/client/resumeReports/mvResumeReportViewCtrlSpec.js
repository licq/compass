describe('mvResumeReportViewCtrl', function () {
  beforeEach(module('compass'));

  var $scope,
    $httpBackend;

  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_) {
    $scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;

    $httpBackend.expectGET('/api/resumeReports/channels').respond(['智联招聘', '前程无忧']);
    $httpBackend.expectGET('/api/resumeReports/applyPositions').respond(['java工程师', '市场总监']);
    $httpBackend.expectGET('/api/resumeReports/counts?applyPosition=&channel=&reportType=day').respond([
      {
        year: 2014,
        month: 5,
        day: 6,
        count: 10
      },
      {
        year: 2014,
        month: 5,
        day: 8,
        count: 20
      }
    ]);

    $controller('mvResumeReportViewCtrl', {
      $scope: $scope
    });
    $httpBackend.flush();
  }));

  describe('initialization', function () {
    it('should set default queryOptions', function () {
      expect($scope.queryOptions).to.deep.equal({
        reportType: 'day',
        applyPosition: '',
        channel: ''
      });
    });

    it('should retrieve the applyPositions', function () {
      expect($scope.applyPositions).to.deep.equal(['java工程师', '市场总监']);
    });

    it('should retrieve the channels', function () {
      expect($scope.channels).to.deep.equal(['智联招聘', '前程无忧']);
    });

    it('should retrieve the resume count list', inject(function (mvMoment) {
      expect($scope.resumeCounts[0].values).to.have.length(mvMoment().add('months', -1).endOf('month').date());
    }));
  });

  describe('change reportType', function () {
    it('should get /api/resumeReports/count', function () {
      $httpBackend.expectGET('/api/resumeReports/counts?applyPosition=&channel=&reportType=week').respond([]);
      $scope.queryOptions.reportType = 'week';
      $scope.$digest();
      $httpBackend.flush();
    });
  });

  describe('change channel', function () {
    it('should get /api/resumeReports/counts', function () {
      $httpBackend.expectGET('/api/resumeReports/counts?applyPosition=&channel=51job&reportType=day').respond([]);
      $scope.queryOptions.channel = '51job';
      $scope.query();
      $httpBackend.flush();
    });
  });
  describe('change applyPosition', function () {
    it('should get /api/resumeReports/counts', function () {
      $httpBackend.expectGET('/api/resumeReports/counts?applyPosition=java&channel=&reportType=day').respond([]);
      $scope.queryOptions.applyPosition = 'java';
      $scope.query();
      $httpBackend.flush();
    });
  });
});