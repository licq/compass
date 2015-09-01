describe('mvApplicationUploadResumeCtrl', function () {

  beforeEach(module('compass'));

  var $httpBackend,
    $scope;

  beforeEach(inject(function ($rootScope, _$httpBackend_, $controller) {
    $scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    $controller('mvApplicationUploadResumeCtrl', {
      $scope: $scope
    });

    $httpBackend.expectGET('/api/resumeReports/applyPositions').respond([
        { _id: '7788', name: '张三'},
        {_id: '8899', name: '李四'}
      ]
    );

    $httpBackend.flush();
  }));

  it('should initialize the positions', function () {
    expect($scope.positions).to.have.length(2);
  });

  it('should initialize status to new', function () {
    expect($scope.status).to.equal('new');
  });
});