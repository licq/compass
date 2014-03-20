describe('mvLoginCtrl', function () {
    beforeEach(module('compass'));

    var mvLoginCtrl,
        $scope,
        $httpBackend;

    beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
        $httpBackend = _$httpBackend_;
        $scope = $rootScope.$new();
        mvLoginCtrl = $controller('mvLoginCtrl', {
            $scope: $scope
        });
    }));

    it('should redirect to /dashboard when login success', inject(function ($location) {
        var userData = {email: 'email', password: 'password', remember_me: true};
        $httpBackend.expectPOST('/api/sessions', userData)
            .respond({email: 'email'});
        var spy = sinon.spy($location, 'path');

        _.merge($scope, userData);

        $scope.login();
        $httpBackend.flush();
        expect(spy).to.have.been.calledWith('/dashboard');
        expect(spy).to.have.been.calledOnce;

    }));

    it('should show error when login failed', function () {
        var userData = {email: 'email', password: 'password', remember_me: true};
        $httpBackend.expectPOST('/api/sessions', userData)
            .respond(401, {message: 'error'});

        _.merge($scope, userData);

        $scope.login();
        $httpBackend.flush();
        expect($scope.errorMessage).to.equal('error');

    });
});