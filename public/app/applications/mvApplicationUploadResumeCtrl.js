angular.module('compass')
  .controller('mvApplicationUploadResumeCtrl', function ($scope, $upload, $http, $location, mvNotifier) {
    $scope.onFileSelect = function ($files) {
      $scope.file = $files[0];
      $scope.resumeFileRequired = false;
    };

    $scope.status = 'new';

    $scope.submit = function () {
      if (!$scope.file) {
        $scope.resumeFileRequired = true;
        return;
      }

      var reader = new FileReader();
      reader.onload = function () {
        var zip = new JSZip();
        var zipFile = zip.file('tmp', reader.result).generate({
          type: 'blob',
          compression: 'DEFLATE',
          compressionOptions: {level: 1}
        });
        zipFile.name = $scope.file.name;

        $upload.upload({
          url: '/api/applications/uploadResume',
          method: 'POST',
          data: {
            applyPosition: $scope.applyPosition,
            status: $scope.status
          },
          file: zipFile,
          fileFormDataName: 'resumeFile'
        })
          .then(function (response) {
            mvNotifier.notify('上传成功');
            $location.path('/resumes/' + response.data._id);
          }, function (response) {
            if (response.status > 0) $scope.err = response.data;
          });
      };
      reader.readAsArrayBuffer($scope.file);
    };

    $http.get('/api/resumeReports/applyPositions').success(function (res) {
      $scope.positions = res;
    });
  });