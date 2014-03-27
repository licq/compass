describe('mvUserNewCtrl', function () {
    var $httpBackend,
        $scope,
        mvUserNewCtrl;

    beforeEach(module('compass'));
    describe('#create', function () {

        beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
            $httpBackend = _$httpBackend_;
            $scope = $rootScope.$new();
            mvUserNewCtrl = $controller('mvUserNewCtrl', {
                $scope: $scope
            });
        }));

        it('should go to success page when create success', inject(function ($location) {
            var userData = {
                name: 'test user',
                email: 'test@test.com',
                password: 'password',
                title: 'ceo'
            };
            $httpBackend.expectPOST('/api/users', userData).respond(200);
            var spy = sinon.spy($location, 'path');

            _.merge($scope.user, userData);

            $scope.create();

            $httpBackend.flush();
            expect(spy).to.have.been.calledWith('/users');
        }));
    });
});