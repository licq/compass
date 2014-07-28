angular.module('compass')
  .controller('mvTutorialCtrl', function ($scope, $modal, $location, mvUser, mvIdentity) {
    mvUser.update({_id: mvIdentity.currentUser._id}, {firstRun: false});

    function goEmailNew() {
      $location.path('/today');
    }

    var modalInstance = $modal.open({
      templateUrl: 'tutorialModalContent.html',
      controller: 'mvTutorialContentCtrl',
      keyboard: false
    });
    modalInstance.result.then(goEmailNew, goEmailNew);

  })
  .controller('mvTutorialContentCtrl', function ($scope, $modalInstance) {
    $scope.close = function () {
      $modalInstance.close();
    };
  });