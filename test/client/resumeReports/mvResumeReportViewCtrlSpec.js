describe('mvResumeReportViewCtrl', function () {
  beforeEach(module('compass'));

  var $scope,
    $httpBackend;

  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_) {
    $scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;

    $httpBackend.expectGET('/api/resumeReports/counts').respond([
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
    it('should retrive the resume count list', function () {
      console.log($scope.resumeCounts[0].values);
      expect($scope.resumeCounts[0].values).to.have.length(3);
    });
  });
});