angular.module('compass')
  .controller('mvPositionListCtrl', function ($scope, mvPosition, $location, mvNotifier) {
    $scope.positions = mvPosition.query();

    $scope.remove = function (position) {
      if (confirm('真的要删除' + position.name + '吗？')) {
        position.$delete(function () {
          _.forEach($scope.positions, function (r, i) {
            if (r._id === position._id) {
              $scope.positions.splice(i, 1);
              return false;
            }
          });
          mvNotifier.notify('删除职位成功');
        }, function (err) {
          $scope.err = err.data;
          mvNotifier.error(err.data.message, '删除职位失败');
        });
      }
    };

    $scope.edit = function (position) {
      $location.path('/settings/positions/edit/' + position._id);
    };
  }
);