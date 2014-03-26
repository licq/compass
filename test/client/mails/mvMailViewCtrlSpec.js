describe('mvMailViewCtrl', function () {
    beforeEach(module('compass'));

    var $httpBackend,
        mvMailViewCtrl,
        $scope;

    beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('/api/mails/7788').respond({address: 'compass@best.com'});

        $scope = $rootScope.$new();
        mvMailViewCtrl = $controller('mvMailViewCtrl', {
            $scope: $scope,
            $routeParams: {id: 7788}
        });
    }));

    it('should get the email list', function () {
        $httpBackend.flush();

        expect($scope.mail).to.exist;
        expect($scope.mail.address).to.equal('compass@best.com');
    });
});