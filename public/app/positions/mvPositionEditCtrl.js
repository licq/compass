angular.module('compass')
  .controller('mvPositionEditCtrl', function ($scope, $location, mvApplicationSetting, $routeParams, mvPosition, mvUser, mvNotifier, $http, $q) {

    $scope.positions = [];
    $http.get('/api/positions/toBeAdded').success(function (res) {
      $scope.positions = $scope.positions.concat(res);
    });

    mvUser.query({fields: 'name', deleted: false}, function (users) {
      $scope.users = users;
      mvPosition.get({_id: $routeParams.id}, function (position) {
        $scope.position = position;
        $scope.positions.push($scope.position.name);
        $scope.selectAll = $scope.position.owners.length === $scope.users.length;
        angular.forEach($scope.users, function (user) {
          user.checked = _.some($scope.position.owners, function (owner) {
            return owner === user._id;
          });
        });
        mvApplicationSetting.get({fields: 'positionRightControlled'}, function (settings) {
          $scope.positionRightControlled = settings.positionRightControlled;
          $scope.dataReady = true;
          $scope.item = {};
        });
      });
    });

    $scope.adding = false;
    $scope.update = function () {
      $scope.position.owners = [];
      angular.forEach($scope.users, function (user) {
        if (user.checked)
          $scope.position.owners.push(user._id);
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

    $scope.loadPositions = function (query) {
      var deferred = $q.defer();

      deferred.resolve(_.filter($scope.positions, function (position) {
        return position.toLowerCase().indexOf(query.toLowerCase()) > -1;
      }));

      return deferred.promise;
    };

    $scope.onSelectAll = function () {
      angular.forEach($scope.users, function (user) {
        user.checked = $scope.selectAll;
      });
    };

    $scope.onSelectUser = function () {
      $scope.selectAll = _.every($scope.users, 'checked');
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

