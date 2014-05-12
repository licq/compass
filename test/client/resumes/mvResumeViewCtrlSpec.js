describe('mvResumeViewCtrl', function () {
  beforeEach(module('compass'));

  var $httpBackend,
    mvResumeViewCtrl,
    $scope;

  beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/resumes/7788').respond({address: 'compass@best.com', _id: '7788',
      mail: '8899'});

    $scope = $rootScope.$new();
    mvResumeViewCtrl = $controller('mvResumeViewCtrl', {
      $scope: $scope,
      $routeParams: {id: 7788}
    });
  }));

  it('should get the resume', function (done) {
    $httpBackend.flush();

    expect($scope.resume).to.exist;
    expect($scope.resume.address).to.equal('compass@best.com');

    $scope.selectMail();
    expect($scope.mailHtml).to.equal('/api/mails/8899/html');
    done();
  });

});