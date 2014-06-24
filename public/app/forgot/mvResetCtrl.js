angular.module('compass')
  .controller('mvResetCtrl', function ($scope, $routeParams, mvForgot) {
    $scope.resetted = false;
    $scope.reset = function () {

      mvForgot.reset({token: $routeParams.token, password: $scope.password}, function () {
        $scope.resetted = true;
      }, function (err) {
        $scope.err = err.data;
      });
    };
  });