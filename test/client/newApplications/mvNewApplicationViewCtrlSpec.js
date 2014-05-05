describe('mvNewApplicationViewCtrl', function () {

    beforeEach(module('compass'));

    var $httpBackend,
        mvNewApplicationViewCtrl,
        $scope;

    beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('/api/applications/7788').respond({name: '张三', _id: '7788', mail: '8899'});
        $scope = $rootScope.$new();
        mvNewApplicationViewCtrl = $controller('mvNewApplicationViewCtrl', {
            $scope: $scope,
            $routeParams: {id: '7788'}
        });

        $httpBackend.flush();
    }));

    it('should have crumbs', function () {
        expect($scope.crumbs).to.have.length(2);
        expect($scope.crumbs[0]).to.deep.equal({
            text: '新应聘',
            url: 'applications/new'
        });
        expect($scope.crumbs[1]).to.deep.equal({
            text: '张三',
            url: '7788'
        });
    });

    it('should get an application', function () {
        expect($scope.resume).to.have.property('_id', '7788');
    });

    it('should set mailhtml correctly', function () {
        $scope.selectMail();
        expect($scope.mailHtml).to.equal('/api/mails/8899/html');
    });
});