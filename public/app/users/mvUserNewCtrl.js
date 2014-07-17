angular.module('compass')
  .controller('mvUserNewCtrl', function ($scope, $location, mvUser, mvPosition, mvRole, mvNotifier) {
    mvRole.query(function (roles) {
      $scope.roles = roles;
      mvPosition.query({fields: 'name'}, function (positions) {
        $scope.positions = positions;
        $scope.user = new mvUser();
      });
    });
    $scope.create = function () {
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

