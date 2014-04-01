describe('mvResumeListCtrl', function () {
    beforeEach(module('compass'));

    var $httpBackend,
        mvResumeListCtrl,
        $scope;

    beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('/api/resumes?page=1&pageSize=10').respond(function () {
            return[200, [
                {address: 'compass@best.com'}
            ], {'totalCount': 20}];
        });

        $scope = $rootScope.$new();
        mvResumeListCtrl = $controller('mvResumeListCtrl', {
            $scope: $scope
        });
    }));

    it('should get the eresume list', function () {
        $httpBackend.flush();

        expect($scope.resumes).to.have.length(1);
        expect($scope.totalResumesCount).to.equal(20);
    });
});