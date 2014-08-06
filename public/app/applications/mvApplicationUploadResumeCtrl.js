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
      var birthday;
      if ($scope.birthdayYear && $scope.birthdayMonth) {
        birthday = moment().year($scope.birthdayYear).month($scope.birthdayMonth - 1).date(1).toISOString();
      }
      $upload.upload({
        url: '/api/applications/uploadResume',
        method: 'POST',
        data: {
          name: $scope.name,
          applyPosition: $scope.applyPosition,
          mobile: $scope.mobile,
          email: $scope.email,
          status: $scope.status,
          birthday: birthday
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