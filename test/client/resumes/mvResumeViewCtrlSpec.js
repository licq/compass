describe('mvResumeViewCtrl', function () {
    beforeEach(module('compass'));

    var $httpBackend,
        mvResumeViewCtrl,
        $scope;

    beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('/api/resumes/7788').respond({address: 'compass@best.com', _id: '7788'});

        $scope = $rootScope.$new();
        mvResumeViewCtrl = $controller('mvResumeViewCtrl', {
            $scope: $scope,
            $routeParams: {id: 7788}
        });
    }));

    it('should get the eresume list', function (done) {
        $httpBackend.flush();

        expect($scope.resume).to.exist;
        expect($scope.resume.address).to.equal('compass@best.com');
        done();
    });

//    it('should invoke the PUT /api/resumes/:id', function (done) {
//        $httpBackend.flush();
//        $httpBackend.expectPUT('/api/resumes/7788').respond(200);
//        expect($scope.parse).to.exist;
//        $scope.parse();
//        $httpBackend.flush();
//        done();
//    });
});