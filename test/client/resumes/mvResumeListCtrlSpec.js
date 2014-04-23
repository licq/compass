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

    it('should invoke the /api/resumes?q=hello', inject(function (states) {
        $scope.states.searchOptions.q = 'hello';
        $httpBackend.expectGET('/api/resumes?page=1&pageSize=10&q=hello').respond(function () {
            return [200, [
                {_id: 'abcd'}
            ], {'totalCount': 20}];
        });
        $scope.getResumes();
        $httpBackend.flush();
        expect($scope.resumes).to.have.length(1);
        expect($scope.totalResumesCount).to.equal(20);
        var state = states.get('mvResumeListCtrl');
        expect(state.pagingOptions.currentPage).to.equal(1);
    }));

    describe('change currentpage to 2', function () {
        beforeEach(function () {
            $httpBackend.flush();
            $httpBackend.expectGET('/api/resumes?page=2&pageSize=10').respond(function () {
                return [200, [
                    {_id: 'abcd'}
                ], {'totalCount': 20}];
            });
            $scope.states.pagingOptions.currentPage = 2;
            $httpBackend.flush();
        });

        it('should change current page to 1 after change pagesize', function () {
            $scope.states.pagingOptions.pageSize = 20;
            setTimeout(function () {
                expect($scope.states.pagingOptions.currentPage).to.equal(1)
            }, 100);
        });

        it('should invoke /api/resumes?page=1&q=hello', function () {
            $scope.states.searchOptions.q = 'hello';
            $scope.search();
            expect($scope.states.pagingOptions.currentPage).to.equal(1);
        });
    });
});