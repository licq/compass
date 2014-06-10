describe('mvResumeReportViewCtrl', function () {
  beforeEach(module('compass'));

  var $scope,
    $httpBackend;

  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_) {
    $scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;

    $httpBackend.expectGET('/api/resumeReports/counts').respond([{
      year: 2014,
      month: 5,
      day: 6,
      count: 10
    },{
      year: 2014,
      month: 6,
      day: 5,
      count: 20
    }]);

    $controller('mvResumeReportViewCtrl', {
      $scope: $scope
    });
    $httpBackend.flush();
  }));

  describe('initialization', function () {
    it('should retrive the resume count list', function () {
      expect($scope.resumeCounts).to.have.length(2);
    });
  });
});