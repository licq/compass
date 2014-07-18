angular.module('compass')
  .controller('mvUserNewCtrl', function ($scope, mvApplicationSetting, $location, mvUser, mvPosition, mvRole, mvNotifier) {
    mvRole.query(function (roles) {
      $scope.roles = roles;
      mvPosition.query({fields: 'name'}, function (positions) {
        $scope.positions = positions;
        $scope.user = new mvUser();
        $scope.selectAll = false;
        angular.forEach($scope.positions, function (position) {
          position.checked = false;
        });
        mvApplicationSetting.get({fields: 'positionRightControlled'}, function (settings) {
          $scope.positionRightControlled = settings.positionRightControlled;
          $scope.dataReady = true;
        });
      });
    });

    $scope.onSelectAll = function () {
      angular.forEach($scope.positions, function (position) {
        position.checked = $scope.selectAll;
      });
    };

    $scope.onSelectPosition = function () {
      $scope.selectAll = _.every($scope.positions, 'checked');
    };

    $scope.create = function () {
      $scope.user.positions = [];
      angular.forEach($scope.positions, function (position) {
        if (position.checked)
          $scope.user.positions.push(position._id);
      });
      $scope.user.$save(function () {
        $location.path('/settings/users');
        mvNotifier.notify('添加用户成功');
      }, function (err) {
        $scope.err = err.data;
        mvNotifier.error('添加用户失败');
      });
    };

    $scope.close = function () {
      $location.path('/settings/users');
    };
  });

