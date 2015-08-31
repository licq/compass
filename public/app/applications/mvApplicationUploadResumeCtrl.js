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

      var reader = new FileReader();
      reader.onload = function () {
        if ($scope.file.name.search(/\.htm.?$/) !== -1)
          $scope.file = new File([StringToBinary(reader.result)], $scope.file.name);
        console.log($scope.file);
        //console.log(reader.result);
        //var zip = new JSZip();
        //var zipFile = new File($scope.file.name, zip.file($scope.file.name + '.zip', reader.result).generate());
        //console.log('zipfile ', zipFile);
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
      reader.readAsText($scope.file);
    };

    function StringToBinary(string) {
      var chars, code, i, isUCS2, len, _i;

      len = string.length;
      chars = [];
      isUCS2 = false;
      for (i = _i = 0; 0 <= len ? _i < len : _i > len; i = 0 <= len ? ++_i : --_i) {
        code = String.prototype.charCodeAt.call(string, i);
        if (code > 255) {
          isUCS2 = true;
          chars = null;
          break;
        } else {
          chars.push(code);
        }
      }
      if (isUCS2 === true) {
        return encodeURIComponent(string);
      } else {
        return String.fromCharCode.apply(null, Array.prototype.slice.apply(chars));
      }
    }

    $http.get('/api/resumeReports/applyPositions').success(function (res) {
      $scope.positions = res;
    });
  });