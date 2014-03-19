describe('directives', function () {

    beforeEach(module('compass'));

    describe('deleteButton', function () {
        var element;
        var scope;

        beforeEach(inject(function ($compile, $rootScope) {
            scope = $rootScope.$new();
            element = angular.element('<delete-button action="clicked=true"></delete-button>');
            element = $compile(element)(scope);
            scope.$digest();
        }));

        it('should create button with class btn', function () {
            expect(element.hasClass('btn')).to.be.true;
            expect(element.hasClass('btn-xs')).to.be.true;
            expect(element.hasClass('btn-danger')).to.be.true;

            var i = element.find('i.fa.fa-times');
            expect(i.length).to.equal(1);
        });

        it('should invoke the action', function () {
            expect(scope.clicked).to.not.exist;

            element.triggerHandler('click');
            expect(scope.clicked).to.be.true;
        });
    });

    describe('editButton', function () {
        var element;
        var scope;

        beforeEach(inject(function ($compile, $rootScope) {
            scope = $rootScope.$new();
            element = angular.element('<edit-button action="clicked=true"></edit-button>');
            element = $compile(element)(scope);
            scope.$digest();
        }));

        it('should create button with class btn', function () {
            expect(element.hasClass('btn')).to.be.true;
            expect(element.hasClass('btn-xs')).to.be.true;
            expect(element.hasClass('btn-warning')).to.be.true;

            var i = element.find('i.fa.fa-pencil');
            expect(i.length).to.equal(1);
        });

        it('should invoke the action', function () {
            expect(scope.clicked).to.not.exist;

            element.triggerHandler('click');
            expect(scope.clicked).to.be.true;
        });
    });

    describe('statusSpan', function () {
        var element;
        var scope;

        beforeEach(inject(function ($compile, $rootScope) {
            scope = $rootScope.$new();
            element = angular.element('<status-span value="true"></status-span>');
            element = $compile(element)(scope);
            scope.$digest();
        }));

        it('should create button with class btn', function () {
            expect(element.hasClass('label')).to.be.true;
            expect(element.hasClass('label-success')).to.be.true;

            expect(element.text()).to.equal('正常');
        });
    });
});