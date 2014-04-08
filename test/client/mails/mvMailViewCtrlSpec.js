describe('mvMailViewCtrl', function () {
    beforeEach(module('compass'));

    var $httpBackend,
        mvMailViewCtrl,
        $scope;

    beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('/api/mails/7788').respond({address: 'compass@best.com', _id: '7788'});

        $scope = $rootScope.$new();
        mvMailViewCtrl = $controller('mvMailViewCtrl', {
            $scope: $scope,
            $routeParams: {id: 7788}
        });
    }));

    it('should get the email list', function (done) {
        $httpBackend.flush();

        expect($scope.mail).to.exist;
        expect($scope.mail.address).to.equal('compass@best.com');
        expect($scope.htmlUrl).to.equal('/api/mails/7788/html');
        done();
    });

    it('should invoke the PUT /api/mails/:id', function (done) {
        $httpBackend.flush();
        $httpBackend.expectPUT('/api/mails/7788').respond(200);
        expect($scope.parse).to.exist;
        $scope.parse();
        $httpBackend.flush();
        done();
    });
});