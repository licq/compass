angular.module('compass')
  .controller('mvPositionNewCtrl', function ($scope, $location, mvPosition, mvApplicationSetting, mvEvaluationCriterion, mvUser, mvNotifier, $http) {
    $scope.dataReady = false;

    $http.get('/api/positions/toBeAdded').success(function (res) {
      $scope.positions = res;
    });

    mvUser.query({fields: 'name'}, function (users) {
      $scope.users = users;
      $scope.selectAll = false;
      angular.forEach($scope.users, function (user) {
        user.checked = false;
      });
      $scope.position = new mvPosition();
      mvEvaluationCriterion.get({}, function (res) {
        if (res && res.items) {
          $scope.position.evaluationCriterions = res.items;
        }
        else {
          $scope.position.evaluationCriterions = [];
        }
        mvApplicationSetting.get({fields: 'positionRightControlled'}, function (settings) {
          $scope.positionRightControlled = settings.positionRightControlled;
          $scope.dataReady = true;
          $scope.item = {};
        });
      });
    });

    $scope.adding = false;
    $scope.create = function () {
      $scope.position.owners = [];
      angular.forEach($scope.users, function (user) {
        if (user.checked)
          $scope.position.owners.push(user._id);
      });
      $scope.position.$save(function () {
        $location.path('/settings/positions');
        mvNotifier.notify('添加职位成功');
      }, function (err) {
        $scope.err = err.data;
        mvNotifier.error('添加职位失败');
      });
    };

    $scope.remove = function (entity) {
      angular.forEach($scope.position.evaluationCriterions, function (item, index) {
        if (item.name === entity.name) {
          $scope.position.evaluationCriterions.splice(index, 1);
        }
      });
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
      $scope.position.evaluationCriterions.push($scope.item);
      $scope.item = {};
      $scope.adding = false;
    };

    $scope.close = function () {
      $location.path('/settings/positions');
    };
  });

