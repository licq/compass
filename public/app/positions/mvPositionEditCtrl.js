angular.module('compass')
  .controller('mvPositionEditCtrl', function ($scope, $location, $routeParams, mvPosition, mvUser, mvNotifier) {
    mvUser.query(function (users) {
      $scope.users = users;
      mvPosition.get({_id: $routeParams.id}, function (position) {
        $scope.position = position;
      });
    });

    $scope.adding = false;

    $scope.update = function () {
      _.forEach($scope.roles,function(role){
        if(role._id === $scope.user.role._id){
          $scope.user.role = role;
          return false;
        }
      });
      $scope.position.$update(function () {
        mvNotifier.notify('修改职位成功');
        $location.path('/settings/positions');
      }, function (err) {
        $scope.err = err.data;
        mvNotifier.error('修改职位失败');
      });
    };

    $scope.remove = function (entity) {
      angular.forEach($scope.position.evaluationCriterions, function (item, index) {
        if (item.name === entity.name) {
          $scope.position.evaluationCriterions.splice(index, 1);
        }
      });
    };

    $scope.add = function () {
      $scope.adding = true;
    };

    $scope.cancel = function () {
      $scope.adding = false;
    };

    $scope.save = function () {
      $scope.adding = false;
      $scope.position.evaluationCriterions.push($scope.item);
      $scope.item = {};
    };

    $scope.close = function () {
      $location.path('/settings/positions');
    };
  });

