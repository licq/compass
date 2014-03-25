describe('mvMailListCtrl', function () {
    beforeEach(module('compass'));

    var $httpBackend,
        mvMailListCtrl,
        $scope;

    beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
        $httpBackend = _$httpBackend_;
        $scope = $rootScope.$new();
        mvMailListCtrl = $controller('mvMailListCtrl', {
            $scope: $scope
        });
    }));

    it('should get the email list', function () {
        $httpBackend.expectGET('/api/mails').respond([]);
        $httpBackend.flush();

        expect($scope.mails).to.be.empty;
    });
});