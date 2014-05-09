describe('mvEmailListCtrl', function () {
    beforeEach(module('compass'));

    var $httpBackend,
        $scope;

    beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
        $httpBackend = _$httpBackend_;
        $scope = $rootScope.$new();
        $controller('mvEmailListCtrl', {
            $scope: $scope
        });
    }));

    it('should get the email list', function () {
        $httpBackend.expectGET('/api/emails').respond([]);
        $httpBackend.flush();

        expect($scope.emails).to.be.empty;
    });
});