describe('mvEmailTemplateListCtrl', function () {
    beforeEach(module('compass'));

    var $httpBackend,
        mvEmailTemplateListCtrl,
        $scope;

    beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
        $httpBackend = _$httpBackend_;
        $scope = $rootScope.$new();
        mvEmailTemplateListCtrl = $controller('mvEmailTemplateListCtrl', {
            $scope: $scope
        });
    }));

    it('should get the emailTemplate list', function () {
        $httpBackend.expectGET('/api/emailTemplates').respond([]);
        $httpBackend.flush();

        expect($scope.emailTemplates).to.be.empty;
    });

    it('should set the crumbs to settings emailTemplates', function () {
        expect($scope.crumbs).to.have.length(2);
    });
});