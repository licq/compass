describe('mvTutorialCtrl', function () {
  beforeEach(module('compass'));
  var $httpBackend,
    $scope;

  it('should PUT /api/users/:id', inject(function ($rootScope, mvIdentity, _$httpBackend_, $controller, $modal, $location) {
    $scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;

    var fakeModal = {
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

    var modalOpenStub = sinon.stub($modal, 'open');
    modalOpenStub.returns(fakeModal);

    var spy = sinon.spy($location, 'path');

    mvIdentity.currentUser = {
      _id: '112',
      name: '包拯'
    };

    $httpBackend.expectPUT('/api/users/112', {firstRun: false}).respond(200);
    $controller('mvTutorialCtrl', {
      $scope: $scope
    });

    $httpBackend.flush();
    fakeModal.close();
    expect(spy).to.have.been.calledWith('/today');
    expect(mvIdentity.currentUser.firstRun).to.be.false;
  }));
});