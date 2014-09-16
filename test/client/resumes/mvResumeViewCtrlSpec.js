describe('mvResumeViewCtrl', function () {
  beforeEach(module('compass'));

  var $httpBackend,
    mvResumeViewCtrl,
    $scope;

  beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/resumes/7788').respond({address: 'compass@best.com', _id: '7788',
      mail: '8899', status: 'archived'});

    $scope = $rootScope.$new();
    mvResumeViewCtrl = $controller('mvResumeViewCtrl', {
      $scope: $scope,
      $routeParams: {id: 7788}
    });

    $httpBackend.flush();
  }));

  it('should get the resume', function (done) {
    expect($scope.resume).to.exist;
    expect($scope.resume.address).to.equal('compass@best.com');
    expect($scope.mailHtml).to.equal('/api/mails/8899/html');
    done();
  });

  describe('back', function () {
    it('should', inject(function ($location) {
      var spy = sinon.spy($location, 'path');
      $scope.back();
      expect(spy).to.have.been.calledWith('/resumes');
    }));
  });

  it('should return successfully', inject(
      function (mvNotifier) {
        $httpBackend.expectPUT('/api/resumes/7788').respond(200);
        var spy = sinon.spy(mvNotifier, 'notify');
        $scope.resetStatus();
        $httpBackend.flush();
        expect(spy).to.have.been.called;
      })
  );
});