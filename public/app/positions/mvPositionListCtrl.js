angular.module('compass')
  .controller('mvPositionListCtrl', function ($scope, mvApplicationSetting, mvPosition, $location, mvNotifier, $filter, $http) {
    $http.get('/api/positions/toBeAdded').success(function (res) {
      $scope.toBeAddedPositions = res;
    });

    mvPosition.query(function (positions) {
      $scope.positions = positions;
      angular.forEach($scope.positions, function (position) {
        position.owners = $filter('orderBy')(position.owners, 'name');
      });
      mvApplicationSetting.get({fields: 'positionRightControlled'}, function (settings) {
        $scope.settings = settings;
      });
    });

    $scope.checked = function () {
      mvApplicationSetting.save($scope.settings);
    };

    $scope.remove = function (position) {
      if (confirm('真的要删除' + position.name + '吗？')) {
        position.$delete(function () {
          $scope.positions.splice(_.findIndex($scope.positions, {'_id': position._id}), 1);
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