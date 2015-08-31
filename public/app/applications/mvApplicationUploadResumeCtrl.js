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

    //function StringToBinary(string) {
    //  var chars, code, i, isUCS2, len, _i;
    //
    //  len = string.length;
    //  chars = [];
    //  isUCS2 = false;
    //  for (i = _i = 0; 0 <= len ? _i < len : _i > len; i = 0 <= len ? ++_i : --_i) {
    //    code = String.prototype.charCodeAt.call(string, i);
    //    if (code > 255) {
    //      isUCS2 = true;
    //      chars = null;
    //      break;
    //    } else {
    //      chars.push(code);
    //    }
    //  }
    //  if (isUCS2 === true) {
    //    return encodeURIComponent(string);
    //  } else {
    //    return String.fromCharCode.apply(null, Array.prototype.slice.apply(chars));
    //  }
    //}

    $scope.submit = function () {
      if (!$scope.file) {
        $scope.resumeFileRequired = true;
        return;
      }

      var reader = new FileReader();
      reader.onload = function () {
        //if ($scope.file.name.search(/\.htm.?$/) !== -1)
        //  $scope.file = new File([StringToBinary(reader.result)], $scope.file.name);
        var zip = new JSZip();
        $scope.file = new File([zip.file($scope.file.name, reader.result).generate({
          type: 'blob',
          compression: 'DEFLATE',
          compressionOptions: {level: 1}
        })], $scope.file.name + '.zip');
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
      reader.readAsArrayBuffer($scope.file);
    };

    $http.get('/api/resumeReports/applyPositions').success(function (res) {
      $scope.positions = res;
    });
  });