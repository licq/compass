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

    $httpBackend.expectGET('/api/resumeReports/summaries?groupBy=channel&groupBy=applyPosition&groupBy=gender&groupBy=age').respond({
      channel: [
        {name: '智联', count: 5},
        {name: '前程', count: 8}
      ],
      applyPosition: [
        {name: 'Java工程师', count: 5},
        {name: '市场总监', count: 8}
      ],
      gender: [
        {name: 'male', count: 5},
        {name: 'female', count: 8}
      ],
      age: [
        {name: 20, count: 5},
        {name: 21, count: 8}
      ]
    });

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

    it('should retrieve the resume count list', inject(function () {
      expect($scope.resumeCounts[0].values).to.have.length(moment().endOf('day').diff(moment().add('months', -1).endOf('day'),'days'));
    }));

    it('should retrieve the channelSummary', function () {
      expect($scope.summaries.channel).to.deep.equal([
        {name: '智联', count: 5},
        {name: '前程', count: 8}
      ]);
    });
    it('should retrieve the applyPositionSummary', function () {
      expect($scope.summaries.applyPosition).to.deep.equal([
        {name: 'Java工程师', count: 5},
        {name: '市场总监', count: 8}
      ]);
    });
    it('should retrieve the genderSummary', function () {
      expect($scope.summaries.gender).to.deep.equal([
        {name: '男', count: 5},
        {name: '女', count: 8}
      ]);
    });
    it('should retrieve the ageSummary', function () {
      expect($scope.summaries.age).to.deep.equal([
        {name: '20-24', count: 13}
      ]);
    });
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