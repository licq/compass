describe('mvApplicationViewCtrl', function () {

  beforeEach(module('compass'));

  var $httpBackend,
    mvApplicationViewCtrl,
    $scope,
    modalOpenStub,
    fakeModal;

  beforeEach(inject(function ($modal) {
    fakeModal = {
      result: {
        then: function (confirmCallback, cancelCallback) {
          this.confirmCallback = confirmCallback;
          this.cancelCallback = cancelCallback;
        }
      },
      close: function (item) {
        this.result.confirmCallback(item);
      },
      dismiss: function (item) {
        this.reuslt.cancelCallback(item);
      }
    };

    modalOpenStub = sinon.stub($modal, 'open');
    modalOpenStub.returns(fakeModal);
  }));

  ['new', 'undertermined', 'archived', 'pursued'].forEach(function (status) {
    describe(status + 'View', function () {
      beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('/api/applications?page=4&pageSize=1&status=' + status).respond({
          hits: {
            total: 6,
            hits: [
              {name: '张三', _id: '7788', mail: '8899'}
            ]
          }
        });
        $scope = $rootScope.$new();
        mvApplicationViewCtrl = $controller('mvApplicationViewCtrl', {
          $scope: $scope,
          $routeParams: {
            index: 4,
            status: status
          }
        });

        $httpBackend.flush();
      }));

      it('should get an application', function () {
        expect($scope.resume).to.have.property('_id', '7788');
      });

      it('should set mailhtml correctly', function () {
        $scope.selectMail();
        expect($scope.mailHtml).to.equal('/api/mails/8899/html');
      });

      describe('pursue', function () {
        it('should PUT /api/applications/:id and then retrieve another one', inject(function (mvNotifier) {
          $httpBackend.expectPUT('/api/applications/7788?status=pursued').respond(200);
          $httpBackend.expectGET('/api/applications?page=4&pageSize=1&status=' + status).respond({
            hits: {
              total: 5,
              hits: [
                {name: '张三', _id: '8899', mail: '8899'}
              ]
            }
          });
          var spy = sinon.spy(mvNotifier, 'notify');

          $scope.pursue({_id: '7788'});

          $httpBackend.flush();
          expect($scope.resume).to.have.property('_id', '8899');
          expect(spy).to.have.been.called;
        }));
      });

      describe('undetermine', function () {
        it('should PUT /api/applications/:id and then retrieve another one', inject(function (mvNotifier) {
          $httpBackend.expectPUT('/api/applications/7788?status=undetermined').respond(200);
          $httpBackend.expectGET('/api/applications?page=4&pageSize=1&status=' + status).respond({
            hits: {
              total: 5,
              hits: [
                {name: '张三', _id: '8899', mail: '8899'}
              ]
            }
          });
          var spy = sinon.spy(mvNotifier, 'notify');

          $scope.undetermine({_id: '7788'});

          $httpBackend.flush();
          expect($scope.resume).to.have.property('_id', '8899');
          expect(spy).to.have.been.called;
        }));
      });

      describe('archive', function () {
        it('should PUT /api/applications/:id and then retrieve another one', inject(function (mvNotifier) {
          $httpBackend.expectPUT('/api/applications/7788?status=archived').respond(200);
          $httpBackend.expectGET('/api/applications?page=4&pageSize=1&status=' + status).respond({
            hits: {
              total: 5,
              hits: [
                {name: '张三', _id: '8899', mail: '8899'}
              ]
            }
          });
          var spy = sinon.spy(mvNotifier, 'notify');

          $scope.archive({_id: '7788'});

          $httpBackend.flush();
          expect($scope.resume).to.have.property('_id', '8899');
          expect(spy).to.have.been.called;
        }));

        it('should goto /applications/new when retrieve another one got empty', inject(function ($location) {
          $httpBackend.expectPUT('/api/applications/7788?status=archived').respond(200);
          $httpBackend.expectGET('/api/applications?page=4&pageSize=1&status=' + status).respond({
            hits: {
              total: 2,
              hits: [ ]
            }
          });
          var spy = sinon.spy($location, 'path');
          $scope.archive({_id: '7788'});

          $httpBackend.flush();
          expect(spy).to.have.been.calledWith('/applications/' + status);
        }));
      });

      describe('newEvent', function () {
        it('should open the modal', function () {
          $scope.newEvent();
          expect(modalOpenStub).to.be.called;
        });

        it('should remove the application from the applications list when modal close', function () {
          $httpBackend.expectGET('/api/applications?page=4&pageSize=1&status=' + status).respond({
            hits: {
              total: 5,
              hits: [
                {name: '张三', _id: '8899', mail: '8899'}
              ]
            }
          });
          $scope.newEvent();
          fakeModal.close('aabb');
          $httpBackend.flush();
        });
      });

      describe('cancel', function () {
        it('should go back to /applications/' + status, inject(function ($location) {
          var spy = sinon.spy($location, 'path');
          $scope.cancel();
          expect(spy).to.have.been.calledWith('/applications/' + status);
        }));
      });
    });
  });
});