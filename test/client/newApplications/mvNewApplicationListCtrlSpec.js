describe('mvNewApplicationListCtrl', function () {
    beforeEach(module('compass'));

    var $httpBackend,
        mvNewApplicationListCtrl,
        $scope;

    beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('/api/applications?page=1&pageSize=50&status=new').respond(function () {
            return[200, [
                {address: 'compass@best.com'}
            ], {'totalCount': 20}];
        });

        $scope = $rootScope.$new();
        mvNewApplicationListCtrl = $controller('mvNewApplicationListCtrl', {
            $scope: $scope
        });
    }));

    it('should GET /api/applications/new to get list', function () {
        $httpBackend.flush();

        expect($scope.applications).to.have.length(1);
        expect($scope.totalCount).to.equal(20);
    });

    it('should have correct crumbs', function () {
        expect($scope.crumbs[0].text).to.equal('新应聘');
    });
});