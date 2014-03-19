describe('mvSignupActivateCtrl', function () {
    var $httpBackend,
        $scope,
        mvSignupNewCtrl;

    describe('#activate', function () {
        beforeEach(module('compass'));
        beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
            $httpBackend = _$httpBackend_;
            $scope = $rootScope.$new();
            mvSignupNewCtrl = $controller('mvSignupActivateCtrl', {
                $scope: $scope,
                $routeParams: {code: '7788'}
            });
        }));

        it('should show success page when create success', function () {
            $httpBackend.expectPUT('/api/signups/7788')
                .respond(200);
            $httpBackend.flush();

            expect($scope.success).to.be.true;
        });
    });
});