angular.module('compass')
  .controller('mvApplicationUploadResumeCtrl', function ($scope, $upload, $http, $location, mvNotifier) {
    $scope.onFileSelect = function ($files) {
      $scope.file = $files[0];
      $scope.resumeFileRequired = false;
    };

    $scope.years = _.range(moment().subtract(14, 'y').year(), moment().subtract(60, 'y').year(), -1);
    $scope.months = _.range(1, 13);
    $scope.status = 'new';
    $scope.gender = 'male';

    $scope.submit = function () {
      if (!$scope.file) {
        $scope.resumeFileRequired = true;
        return;
      }
      $upload.upload({
        url: '/api/applications/uploadResume',
        method: 'POST',
        data: {
          applyPosition: $scope.applyPosition,
          status: $scope.status
        },
        file: $scope.file,
        fileFormDataName: 'resumeFile'
      })
        .then(function (response) {
          mvNotifier.notify('上传成功');
          $location.path('/resumes/' + response.data._id);
        }, function (response) {
          if (response.status > 0) $scope.err = response.data;
        });
    };

    $http.get('/api/resumeReports/applyPositions').success(function (res) {
      $scope.positions = res;
    });
  });