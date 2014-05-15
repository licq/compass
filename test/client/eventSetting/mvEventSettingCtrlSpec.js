describe('mvEventSettingCtrlSpec', function () {
  beforeEach(module('compass'));

  var $scope,
    $httpBackend;

  describe('eventSetting existed', function () {
    beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
      $httpBackend = _$httpBackend_;
      $scope = $rootScope.$new();
      $httpBackend.expectGET('/api/eventSettings').respond({
        duration: 90,
        newToApplier: true,
        newTemplateToApplier: '',
        editToApplier: true,
        editTemplateToApplier: '',
        deleteToApplier: true,
        deleteTemplateToApplier: ''
      });

      $controller('mvEventSettingCtrl', {
        $scope: $scope
      });

      $httpBackend.flush();
    }));

    it('should set crumbs', function () {
      expect($scope.crumbs[0]).to.deep.equal({
        text: '设置',
        url: 'settings'
      });
      expect($scope.crumbs[1]).to.deep.equal({
        text: '面试设置',
        url: 'eventSetting'
      });
    });

    it('should GET /api/eventSettings', function () {
      expect($scope.eventSetting).to.exist;
    });

    describe('save', function () {
      it('should POST /api/eventSettings', inject(function (mvNotifier) {
        var spy = sinon.spy(mvNotifier, 'notify');
        $scope.eventSetting.newTemplateToApplier = 'hello from test';
        $httpBackend.expectPOST('/api/eventSettings', {
          duration: 90,
          newToApplier: true,
          newTemplateToApplier: 'hello from test',
          editToApplier: true,
          editTemplateToApplier: '',
          deleteToApplier: true,
          deleteTemplateToApplier: ''
        }).respond(200);
        $scope.save();
        $httpBackend.flush();
        expect(spy).to.have.been.called;
      }));
    });
  });
});