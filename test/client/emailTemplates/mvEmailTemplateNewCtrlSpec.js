describe('mvEmailTemplateNewCtrl', function () {
    beforeEach(module('compass'));

    var $httpBackend,
        mvEmailTemplateNewCtrl,
        $scope;

    beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
        $httpBackend = _$httpBackend_;
        $scope = $rootScope.$new();
        mvEmailTemplateNewCtrl = $controller('mvEmailTemplateNewCtrl', {
            $scope: $scope
        });
    }));

    it('should initialize a default EmailTemplate object', function () {
        expect($scope.emailTemplate).to.exist;
    });

    it('should create new EmailTemplate and redirect to /settings/emailTemplates', inject(function ($location) {
        var data = {
            subject: 'This is the email template subject',
            name: 'This is the email template name',
            content: 'this is the the email template content'
        };

        $httpBackend.expectPOST('/api/emailTemplates', data).respond(200);
        var spy = sinon.spy($location, 'path');
        _.merge($scope.emailTemplate, data);

        $scope.create();
        $httpBackend.flush();

        expect(spy).to.have.been.calledWith('/settings/emailTemplates');
    }));

    it('should set error when remote failed', function () {
        $httpBackend.expectPOST('/api/emailTemplates').respond(400, {message: 'name is duplicated'});

        $scope.create();
        $httpBackend.flush();

        expect($scope.err).to.exist;
    });

    it('should have three crumbs', function () {
        expect($scope.crumbs).to.have.length(3);
    });

    it('should go to /settings/emailTemplates when click cancel', inject(function ($location) {
        var spy = sinon.spy($location, 'path');
        $scope.cancel();

        expect(spy).to.have.been.calledWith('/settings/emailTemplates');
    }));
});