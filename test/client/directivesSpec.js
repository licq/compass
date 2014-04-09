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

    describe('viewButton', function () {
        var element;
        var scope;

        beforeEach(inject(function ($compile, $rootScope) {
            scope = $rootScope.$new();
            element = angular.element('<view-button action="clicked=true"></view-button>');
            element = $compile(element)(scope);
            scope.$digest();
        }));

        it('should create button with class btn', function () {
            expect(element).to.have.class('btn');
            expect(element).to.have.class('btn-xs');
            expect(element).to.have.class('btn-success');

            expect(element).to.have('i.fa.fa-archive');
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
            element = angular.element('<status-span value="false">正常</status-span>');
            element = $compile(element)(scope);
            scope.$digest();
        }));

        it('should create button with class btn', function () {
            expect(element.hasClass('label')).to.be.true;
            expect(element.hasClass('label-success')).to.be.true;

            expect(element.text()).to.equal('正常');
        });
    });

    describe('breadcrumbs', function () {
        describe('with empty data', function () {
            var element;
            var scope;

            beforeEach(inject(function ($compile, $rootScope) {
                scope = $rootScope.$new();
                element = angular.element('<breadcrumbs></breadcrumbs>');
                element = $compile(element)(scope);
                scope.$digest();
            }));

            it('should create breadcrumbs with home link', function () {
                expect(element.find('h2').text()).to.equal('主页');
                var link = element.find('a');
                expect(link.length).to.equal(1);
                expect(link.attr('href')).to.equal('/');
                expect(link.text()).to.equal('主页');
                expect(element.find('.clearfix').length).to.equal(1);
            });

        });
        describe('with values', function () {
            var element;
            var scope;

            beforeEach(inject(function ($compile, $rootScope) {
                scope = $rootScope.$new();
                scope.crumbs = [
                    {text: '邮件列表', url: 'mails'},
                    {text: 'subject', url: '7788'}
                ];
                element = angular.element('<breadcrumbs crumbs="crumbs"></breadcrumbs>');
                element = $compile(element)(scope);
                scope.$digest();
            }));

            it('should create breadcrumbs with home link', function () {
                expect(element.find('h2').text()).to.equal('subject');
                var links = element.find('a');
                expect(links.length).to.equal(3);
                expect(links.eq(0).attr('href')).to.equal('/');
                expect(links.eq(1).attr('href')).to.equal('/mails');
                expect(links.eq(2).attr('href')).to.equal('/mails/7788');
                expect(links.eq(2).hasClass('bread-current')).to.be.true;
                expect(links.eq(0).text()).to.equal('主页');
                expect(links.eq(1).text()).to.equal('邮件列表');
                expect(links.eq(2).text()).to.equal('subject');
            });

        });
    });
});