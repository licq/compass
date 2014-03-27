describe('mvUserEditCtrl', function () {
    beforeEach(module('compass'));

    var $httpBackend,
        mvUserEditCtrl,
        $scope;

    var userData = {
        email: 'aa@aa.com',
        name: 'aa',
        password: 'aa',
        title: 'ceo',
        port: 110,
        _id: 7788
    };

    beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
        $httpBackend = _$httpBackend_;
        $scope = $rootScope.$new();
        mvUserEditCtrl = $controller('mvUserEditCtrl', {
            $scope: $scope,
            $routeParams: {id: '7788'}
        });
    }));

    it('should get user object', function () {
        $httpBackend.expectGET('/api/users/7788').respond(userData);
        $httpBackend.flush();

        expect($scope.user).to.exist;
    });

    it('should update user and redirect to /users', inject(function ($location) {
        $httpBackend.expectGET('/api/users/7788').respond(userData);
        $httpBackend.flush();

        $httpBackend.expectPUT('/api/users/7788', userData).respond(200);
        var spy = sinon.spy($location, 'path');

        $scope.update();
        $httpBackend.flush();

        expect(spy).to.have.been.calledWith('/users');
    }));
});