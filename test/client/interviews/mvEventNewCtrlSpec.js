describe('mvEventNewCtrl', function () {
    beforeEach(module('compass'));

    var $httpBackend,
        mvEventNewCtrl,
        modalInstanceMock,
        $scope;

    beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('/api/users?fields=name').respond([
            {
                _id: '7788'
            },
            {
                _id: '8899'
            }
        ]);

        $scope = $rootScope.$new();
        var modalInstanceAPI = {
            dismiss: function () {
            },
            close: function () {
            }
        };
        modalInstanceMock = sinon.mock(modalInstanceAPI);
        mvEventNewCtrl = $controller('mvEventNewCtrl', {
            $scope: $scope,
            $modalInstance: modalInstanceAPI,
            application: {
                name: 'aabb',
                email: 'aa@aa.com',
                mobile: '137838383838',
                _id: '9900'
            }
        });
        $httpBackend.flush();
    }));

    it('should set today to today midnight', function () {
        var today = $scope.today;
        var date = new Date();
        expect(today.getYear()).to.equal(date.getYear());
        expect(today.getMonth()).to.equal(date.getMonth());
        expect(today.getDay()).to.equal(date.getDay());
        expect(today.getHours()).to.equal(0);
        expect(today.getMinutes()).to.equal(0);
        expect(today.getSeconds()).to.equal(0);
    });

    it('should initialize event', function () {
        expect($scope.application).to.exist;
        expect($scope.event.application).to.equal('9900');
        expect($scope.event.sendEventAlert).to.equal(false);
    });

    it('should set users ', function () {
        expect($scope.users).to.have.length(2);
        expect($scope.users[0]._id).to.equal('7788');
        expect($scope.users[1]._id).to.equal('8899');
    });

    it('should retrieve emailTemplates when sendEventAlert set to true', function () {
        $httpBackend.expectGET('/api/emailTemplates?fields=name').respond([
            {
                _id: '1122'
            }
        ]);
        $scope.event.sendEventAlert = true;
        $httpBackend.flush();
        expect($scope.emailTemplates).to.have.length(1);
        expect($scope.emailTemplates[0]).to.have.property('_id', '1122');
    });

    describe('create', function () {
        it('should post /api/events and close the window and send notification', inject(function (mvNotifier) {
            $httpBackend.expectGET('/api/emailTemplates?fields=name').respond([
                {
                    _id: '1122'
                }
            ]);

            $scope.event.sendEventAlert = true;
            $scope.event.interviewers = ['aa', 'bb'];
            $scope.event.emailTemplate = '2233';
            $scope.event.time = '2014/05/09 14:00';
            $scope.event.duration = 90;
            $httpBackend.flush();

            $httpBackend.expectPOST('/api/events',
                {
                    duration: 90,
                    application: '9900',
                    time: '2014/05/09 14:00',
                    interviewers: ['aa', 'bb'],
                    sendEventAlert: true,
                    emailTemplate: '2233'
                })
                .respond(200);

            var spy = sinon.spy(mvNotifier, 'notify');
            modalInstanceMock.expects('close').once();
            $scope.create();
            $httpBackend.flush();
            modalInstanceMock.verify();
            expect(spy).to.have.been.called;
        }));
    });

    describe('cancel', function () {
        it('should invoke dismiss method of modalInstance', function () {
            modalInstanceMock.expects('dismiss').once();
            $scope.cancel();
            modalInstanceMock.verify();
        });
    });
});