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

    it('should create new email and redirect to /emails', inject(function ($location) {
        var emailData = {
            address: 'aa@aa.com',
            account: 'aa',
            password: 'aa',
            server: 'aa.com',
            port: 110
        };

        $httpBackend.expectPOST('/api/emails', emailData).respond(200);
        var spy = sinon.spy($location, 'path');
        _.merge($scope.email, emailData);

        $scope.create();
        $httpBackend.flush();

        expect(spy).to.have.been.calledWith('/emails');
    }));
});