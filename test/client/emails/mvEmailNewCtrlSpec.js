describe('mvEmailNewCtrl', function () {
    beforeEach(module('compass'));

    var $httpBackend,
        mvEmailNewCtrl,
        $scope;

    beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
        $httpBackend = _$httpBackend_;
        $scope = $rootScope.$new();
        mvEmailNewCtrl = $controller('mvEmailNewCtrl', {
            $scope: $scope
        });
    }));

    it('should initialize a default email object', function () {
        expect($scope.email).to.exist;
        expect($scope.email.port).to.equal(110);
    });

    describe('create new email', function () {
        var emailData;
        beforeEach(function () {
            emailData = {
                address: 'aa@aa.com',
                account: 'aa',
                password: 'aa',
                server: 'aa.com',
                port: 110
            };
        });

        it('should redirect to /emails when success', inject(function ($location, mvNotifier) {
            var notifySpy = sinon.spy(mvNotifier, 'notify');
            $httpBackend.expectPOST('/api/emails', emailData).respond(200);
            var spy = sinon.spy($location, 'path');
            _.merge($scope.email, emailData);

            $scope.create();
            $httpBackend.flush();

            expect(spy).to.have.been.calledWith('/emails');
            expect(notifySpy).to.have.been.calledWith('添加简历邮箱成功');
        }));

        it('should show error when create failed', inject(function ($location, mvNotifier) {
            var notifySpy = sinon.spy(mvNotifier, 'error');
            $httpBackend.expectPOST('/api/emails', emailData).respond(500, {message: 'error'});
            _.merge($scope.email, emailData);

            $scope.create();
            $httpBackend.flush();

            expect(notifySpy).to.have.been.calledWith('添加简历邮箱失败');
        }));
    });
});