//describe('mvApplicationSettingCtrlSpec', function () {
//  beforeEach(module('compass'));
//
//  var $scope,
//    $httpBackend;
//
//  describe('ApplicationSetting existed', function () {
//    beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
//      $httpBackend = _$httpBackend_;
//      $scope = $rootScope.$new();
//      $httpBackend.expectGET('/api/ApplicationSettings').respond({
//        positionRightControlled: false
//      });
//
//      $controller('mvApplicationSettingCtrl', {
//        $scope: $scope
//      });
//
//      $httpBackend.flush();
//    }));
//
//    it('should GET /api/ApplicationSettings', function () {
//      expect($scope.applicationSetting).to.exist;
//    });
//
//    describe('save', function () {
//      it('should POST /api/ApplicationSettings', inject(function (mvNotifier) {
//        var spy = sinon.spy(mvNotifier, 'notify');
//        $scope.applicationSetting.positionRightControlled = true;
//        $httpBackend.expectPOST('/api/ApplicationSettings', {
//          positionRightControlled: true
//        }).respond(200);
//        $scope.save();
//        $httpBackend.flush();
//        expect(spy).to.have.been.called;
//      }));
//    });
//  });
//});