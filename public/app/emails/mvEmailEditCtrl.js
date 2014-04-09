'use strict';

angular.module('compass')
    .controller('mvEmailEditCtrl', function ($scope, mvEmail, $routeParams, $location) {

        $scope.email = mvEmail.get({_id: $routeParams.id}, function (email) {
            $scope.email = email;
            $scope.crumbs = [
                {text: '简历邮箱', url: 'emails'},
                {text: '修改', url: 'edit/' + email._id}
            ];
        });

        $scope.update = function () {
            $scope.saving = true;
            $scope.email.$update(function () {
                $location.path('/emails');
            }, function (err) {
                console.log(err);
                $scope.saving = false;
                $scope.err = err.data;
            });
        };

        $scope.cancel = function () {
            $location.path('/emails');
        };
    });