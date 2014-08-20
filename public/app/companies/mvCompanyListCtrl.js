angular.module('compass')
  .controller('mvCompanyListCtrl', function ($scope, mvCompany) {
    $scope.companies = mvCompany.query(function(){
    });
  });