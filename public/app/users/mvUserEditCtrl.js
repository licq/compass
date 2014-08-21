'use strict';

angular.module('compass')
  .controller('mvUserEditCtrl', function ($scope, $rootScope, mvUser, mvApplicationSetting, mvRole, mvPosition, $routeParams, mvPermission, mvIdentity, $location, mvNotifier) {
    mvRole.query(function (roles) {
      $scope.roles = roles;
      mvPosition.query({fields: 'name'}, function (positions) {
        $scope.positions = positions;
        mvUser.get({_id: $routeParams.id}, function (user) {
          $scope.user = user;
          mvUser.query({fields: 'department', deleted: false}, function (departments) {
            $scope.departments = _.uniq(_.compact(_.pluck(departments, 'department')));
            $scope.selectAll = $scope.user.positions.length === $scope.positions.length;
            angular.forEach($scope.positions, function (position) {
              position.checked = _.some($scope.user.positions, function (userPosition) {
                return userPosition === position._id;
              });
            });
            mvApplicationSetting.get({fields: 'positionRightControlled'}, function (settings) {
              $scope.positionRightControlled = settings.positionRightControlled;
              $scope.dataReady = true;
            });
          });
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

    $scope.update = function () {
      $scope.user.positions = [];
      angular.forEach($scope.positions, function (position) {
        if (position.checked)
          $scope.user.positions.push(position._id);
      });
      $scope.user.role = _.find($scope.roles, {'_id': $scope.user.role._id});
      $scope.user.$update(function () {
        $rootScope.$broadcast('userChanged', $scope.user);
        mvNotifier.notify('修改用户成功');
        $location.path('/settings/users');
      }, function (err) {
        $scope.err = err.data;
        mvNotifier.error('修改用户失败');
      });
    };

    $scope.cancel = function () {
      $location.path('/settings/users');
    };

  });