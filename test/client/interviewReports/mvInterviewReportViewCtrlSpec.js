describe('mvInterviewReportViewCtrl', function () {
  beforeEach(module('compass'));

  var $scope,
    $httpBackend;

  beforeEach(inject(function ($rootScope, $controller, _$httpBackend_) {
    $scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/applyPositions').respond(['java工程师', '市场总监']);
    $httpBackend.expectGET('/api/interviewReports/counts?applyPosition=&reportType=day').respond([
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
    $httpBackend.expectGET('/api/interviewReports/summaries?groupBy=status&groupBy=applyPosition').respond({
      status: [
        {name: 'new', count: 5},
        {name: 'offered', count: 8}
      ],
      applyPosition: [
        {name: 'Java工程师', count: 5},
        {name: '市场总监', count: 8}
      ]
    });

    $controller('mvInterviewReportViewCtrl', {
      $scope: $scope
    });

    $httpBackend.flush();
  }));

  describe('initialization', function () {
    it('should set default queryOptions', function () {
      expect($scope.queryOptions).to.deep.equal({
        reportType: 'day',
        applyPosition: ''
      });
    });

    it('should set statuses', function () {
      expect($scope.applyPositions).to.deep.equal(['java工程师', '市场总监']);
    });

    it('should get the interviewCounts', inject(function () {
      expect($scope.interviewCounts[0].values).to.have.length(moment().add('months', -1).endOf('month').date());
    }));

    it('should retrieve the applyPositionSummary', function () {
      expect($scope.summaries.applyPosition).to.deep.equal([
        {name: 'Java工程师', count: 5},
        {name: '市场总监', count: 8}
      ]);
    });

    it('should retrieve the applyPositionSummary', function () {
      expect($scope.summaries.status).to.deep.equal([
        {name: '面试中', count: 5},
        {name: '面试通过', count: 8}
      ]);
    });
  });

  describe('change reportType', function () {
    it('should get /api/interviewReports/counts', function () {
      $httpBackend.expectGET('/api/interviewReports/counts?applyPosition=&reportType=week').respond([]);
      $scope.queryOptions.reportType = 'week';
      $scope.$digest();
      $httpBackend.flush();
    });
  });

  describe('change applyPosition', function () {
    it('should get /api/interviewReports/counts', function () {
      $httpBackend.expectGET('/api/interviewReports/counts?applyPosition=java&reportType=day').respond([]);
      $scope.queryOptions.applyPosition = 'java';
      $scope.query();
      $httpBackend.flush();
    });
  });
});