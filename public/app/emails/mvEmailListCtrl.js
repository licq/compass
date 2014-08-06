'use strict';

angular.module('compass')
  .controller('mvEmailListCtrl', function ($scope, mvEmail, $location) {
    mvEmail.query(function (emails) {
      $scope.emails = emails;
    });

    $scope.remove = function (email) {
      if (confirm('真的要删除' + email.address + '吗？')) {
        email.$delete(function () {
          angular.forEach($scope.emails, function (inEmail, index) {
            if (inEmail === email) {
              $scope.emails.splice(index, 1);
            }
          });
        });
      }
    };

    $scope.edit = function (email) {
      $location.path('/settings/emails/edit/' + email._id);
    };
  });