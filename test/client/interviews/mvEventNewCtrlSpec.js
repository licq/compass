describe('mvEventNewCtrl', function () {
  beforeEach(module('compass'));

  var $httpBackend,
    modalInstanceMock,
    modalInstanceAPI,
    $scope;

  beforeEach(inject(function (_$httpBackend_, $rootScope) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/users?fields=name').respond([
      {
        _id: '7788'
      },
      {
        _id: '8899'
      }
    ]);

    $httpBackend.expectGET('/api/emailTemplates?fields=name').respond([
      {
        _id: '1122'
      }
    ]);

    $scope = $rootScope.$new();
    modalInstanceAPI = {
      dismiss: function () {
      },
      close: function () {
      }
    };
    modalInstanceMock = sinon.mock(modalInstanceAPI);
  }));

  describe('new', function () {
    beforeEach(inject(function ($controller) {
      $controller('mvEventNewCtrl', {
        $scope: $scope,
        $modalInstance: modalInstanceAPI,
        event: {
          name: 'aabb',
          email: 'aa@aa.com',
          mobile: '137838383838',
          application: '9900'
        }
      });
      $httpBackend.flush();
    }));

    it('should set $scope.isNew to be true', function () {
      expect($scope.isNew).to.be.true;
    });
    it('should set today to today midnight', inject(function (mvMoment) {
      var today = $scope.today;
      expect(mvMoment().diff(today, 'days')).to.equal(0);
    }));

    it('should initialize event', function () {
      expect($scope.event.application).to.equal('9900');
    });

    it('should set users ', function () {
      expect($scope.users).to.have.length(2);
      expect($scope.users[0]._id).to.equal('7788');
      expect($scope.users[1]._id).to.equal('8899');
    });

    it('should retrieve emailTemplates', function () {
      expect($scope.emailTemplates).to.have.length(1);
      expect($scope.emailTemplates[0]).to.have.property('_id', '1122');
    });

    describe('create', function () {
      it('should post /api/events and close the window and send notification', inject(function (mvNotifier) {
        $scope.event.sendEventAlert = true;
        $scope.event.interviewers = ['aa', 'bb'];
        $scope.event.emailTemplate = '2233';
        $scope.event.time = '2014/05/09 14:00';
        $scope.event.duration = 90;

        $httpBackend.expectPOST('/api/events',
          {
            duration: 90,
            application: '9900',
            time: '2014/05/09 14:00',
            interviewers: ['aa', 'bb'],
            sendEventAlert: true,
            emailTemplate: '2233',
            name: 'aabb',
            email: 'aa@aa.com',
            mobile: '137838383838',
          })
          .respond(200);

        var spy = sinon.spy(mvNotifier, 'notify');
        modalInstanceMock.expects('close').once().withArgs($scope.event);
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


  describe('edit', function () {
    beforeEach(inject(function ($controller) {
      $controller('mvEventNewCtrl', {
        $scope: $scope,
        $modalInstance: modalInstanceAPI,
        event: {
          _id: '9911',
          time: new Date(),
          interviewers: ['222', '333'],
          sendEventAlert: false,
          duration: 60,
          application: '9900',
          name: 'aabb',
          email: 'aa@aa.com',
          mobile: '137838383838'
        }
      });
      $httpBackend.flush();
    }));

    it('should set $scope.isNew to false', function () {
      expect($scope.isNew).to.be.false;
    });

    it('should PUT /api/events/:id and close the window and send notification', inject(function (mvNotifier) {
      $scope.event.duration = 90;
      $scope.event.time = '2014/05/09 14:00';
      $httpBackend.expectPUT('/api/events/9911',
        {
          _id: '9911',
          duration: 90,
          application: '9900',
          time: '2014/05/09 14:00',
          interviewers: ['222', '333'],
          sendEventAlert: false,
          name: 'aabb',
          email: 'aa@aa.com',
          mobile: '137838383838'
        })
        .respond(200);

      var spy = sinon.spy(mvNotifier, 'notify');
      modalInstanceMock.expects('close').once().withArgs($scope.event);
      $scope.update();
      $httpBackend.flush();
      modalInstanceMock.verify();
      expect(spy).to.have.been.called;
    }));
  });
});