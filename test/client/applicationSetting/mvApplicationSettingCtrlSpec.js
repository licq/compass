describe('mvApplicationSettingCtrlSpec', function () {
  beforeEach(module('compass'));

  var $scope,
    $httpBackend;

  describe('ApplicationSetting existed', function () {
    beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
      $httpBackend = _$httpBackend_;
      $scope = $rootScope.$new();
      $httpBackend.expectGET('/api/applicationSettings').respond({
        positionRightControlled: false,
        filterSamePerson: 0,
        rejectLetterToApplier: false,
        rejectLetterToApplierTemplate: 'Thank you'
      });

      $controller('mvApplicationSettingCtrl', {
        $scope: $scope
      });

      $httpBackend.flush();
    }));

    it('should GET /api/applicationSettings', function () {
      expect($scope.applicationSetting).to.exist;
    });

    it('should initialize the applicationFilterOptions', function () {
      expect($scope.applicationFilterOptions).to.deep.equal([
        {label: '不过滤', value: 0},
        {label: '3个月内不允许重复投递', value: 3},
        {label: '半年内不允许重复投递', value: 6},
        {label: '一年内不允许重复投递', value: 12},
        {label: '两年内不允许重复投递', value: 24},
        {label: '永远不允许再投递', value: 999},
      ]);
    });

    describe('save', function () {
      it('should POST /api/applicationSettings', inject(function (mvNotifier) {
        var spy = sinon.spy(mvNotifier, 'notify');
        $httpBackend.expectPOST('/api/applicationSettings', {
          positionRightControlled: false,
          filterSamePerson: 12,
          rejectLetterToApplier: true,
          rejectLetterToApplierTemplate: 'Thank you'
        }).respond(200);
        $scope.applicationSetting.filterSamePerson = 12;
        $scope.applicationSetting.rejectLetterToApplier = true;
        $scope.save();
        $httpBackend.flush();
        expect($scope.applicationSetting.filterSamePerson).to.equal(12);
        expect(spy).to.have.been.called;
      }));
    });
  });
});