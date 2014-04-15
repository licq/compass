describe('mvEmailTemplateEditCtrl', function () {
    beforeEach(module('compass'));

    var $httpBackend,
        mvEmailTemplateEditCtrl,
        $scope;

    var emailTemplateData = {
        _id: 7788
    };

    beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
        $httpBackend = _$httpBackend_;
        $scope = $rootScope.$new();
        mvEmailTemplateEditCtrl = $controller('mvEmailTemplateEditCtrl', {
            $scope: $scope,
            $routeParams: {id: '7788'}
        });
    }));

    it('should get emailTemplate object', function () {
        $httpBackend.expectGET('/api/emailTemplates/7788').respond(emailTemplateData);
        $httpBackend.flush();

        expect($scope.emailTemplate).to.exist;
    });

    it('should update emailTemplate and redirect to /emailTemplates', inject(function ($location,mvNotifier) {
        var notifySpy = sinon.spy(mvNotifier, 'notify');
        $httpBackend.expectGET('/api/emailTemplates/7788').respond(emailTemplateData);
        $httpBackend.flush();

        $httpBackend.expectPUT('/api/emailTemplates/7788', emailTemplateData).respond(200);
        var spy = sinon.spy($location, 'path');

        $scope.update();
        $httpBackend.flush();

        expect(spy).to.have.been.calledWith('/settings/emailTemplates');
        expect(notifySpy).to.have.been.calledWith('修改邮件模板成功');
    }));

    it('should show error if update failed', inject(function (mvNotifier) {
        var notifySpy = sinon.spy(mvNotifier,'error');
        $httpBackend.expectGET('/api/emailTemplates/7788').respond(emailTemplateData);
        $httpBackend.flush();

        $httpBackend.expectPUT('/api/emailTemplates/7788', emailTemplateData).respond(400, {message: '名称重复'});

        $scope.update();
        $httpBackend.flush();

        expect($scope.err).to.exist;
        expect($scope.err.message).to.equal('名称重复');
        expect(notifySpy).to.have.been.calledWith('修改简历模板失败');
    }));

    it('should have correct breadcrumbs', function () {
        $httpBackend.expectGET('/api/emailTemplates/7788').respond(emailTemplateData);
        $httpBackend.flush();
        expect($scope.crumbs).to.have.length(3);
        expect($scope.crumbs[2]).to.have.property('text', '修改');
    });

    it('should go back to /settings/emailTemplates', inject(function ($location) {
        var spy = sinon.spy($location, 'path');
        $scope.cancel();
        expect(spy).to.have.been.calledWith('/settings/emailTemplates');
    }));
});