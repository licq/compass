describe('mvEmailTemplateListCtrl', function () {
    beforeEach(module('compass'));

    var $httpBackend,
        mvEmailTemplateListCtrl,
        $scope,
        confirmStub,
        emailTemplate1, emailTemplate2;

    beforeEach(inject(function (_$httpBackend_, $rootScope, $controller, mvEmailTemplate,$window) {
        $httpBackend = _$httpBackend_;
        $scope = $rootScope.$new();
        mvEmailTemplateListCtrl = $controller('mvEmailTemplateListCtrl', {
            $scope: $scope
        });
        emailTemplate1 = new mvEmailTemplate({_id: '7788'});
        emailTemplate2 = new mvEmailTemplate({_id: '8899'});
        confirmStub = sinon.stub($window,'confirm');
        confirmStub.returns(true);
    }));

    afterEach(function(){
        confirmStub.restore();
    });

    it('should get the emailTemplate list', function () {
        $httpBackend.expectGET('/api/emailTemplates').respond([]);
        $httpBackend.flush();

        expect($scope.emailTemplates).to.be.empty;
    });

    it('should set the crumbs to settings emailTemplates', function () {
        expect($scope.crumbs).to.have.length(2);
    });

    describe('edit', function () {
        it('should go to the edit page of the corresponding emailTemplate', inject(function ($location) {
            var spy = sinon.spy($location, 'path');

            $scope.edit({
                entity: {
                    _id: '7788'
                }
            });
            expect(spy).to.have.been.calledWith('/settings/emailTemplates/edit/7788');
        }));
    });

    describe('remove', function () {
        it('should invoke the remove and remove from local list', function () {
            $httpBackend.whenGET('/api/emailTemplates').respond([emailTemplate1, emailTemplate2 ]);
            $httpBackend.flush();
            expect($scope.emailTemplates).to.have.length(2);

            $httpBackend.expectDELETE('/api/emailTemplates/7788').respond(200);
            $scope.remove({entity: emailTemplate1});
            $httpBackend.flush();
            expect($scope.emailTemplates).to.have.length(1);
            expect($scope.emailTemplates[0]._id).to.equal(emailTemplate2._id);
        });
    });
});